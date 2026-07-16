import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, createPaymentOrder, clearBookingState } from '@/redux/slices/bookingSlice';
import { CalendarDays, MapPin, Info, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

/** Lazily inject the Razorpay checkout script only when needed */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function FloatingBookingWidget({ vehicle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { loading, error } = useSelector(state => state.booking);

  // Form State
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [location, setLocation] = useState(vehicle?.location?.city || '');

  // Calculation State
  const [days, setDays] = useState(0);
  const [baseTotal, setBaseTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Clear booking errors on mount and unmount
  useEffect(() => {
    dispatch(clearBookingState());
    return () => dispatch(clearBookingState());
  }, [dispatch]);

  // Today minimum date for picker
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (pickupDate && dropoffDate) {
      // Clear any previous booking error when user changes dates
      dispatch(clearBookingState());

      const pDate = new Date(pickupDate);
      const dDate = new Date(dropoffDate);
      const diffTime = Math.abs(dDate - pDate);
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      setDays(diffDays);
      const base = diffDays * (vehicle?.pricePerDay || 0);
      setBaseTotal(base);
      const taxAmount = base * 0.18; // 18% GST typical for India/Luxury
      setTaxes(taxAmount);
      setGrandTotal(base + taxAmount);
    } else {
      setDays(0);
      setBaseTotal(0);
      setTaxes(0);
      setGrandTotal(0);
    }
  }, [pickupDate, dropoffDate, vehicle]);

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/vehicles/' + vehicle._id);
      return;
    }

    if (!pickupDate || !dropoffDate || !location) {
      alert("Please fill all booking details");
      return;
    }

    // 1. Create Pending Booking
    const bookingResult = await dispatch(createBooking({
      vehicleId: vehicle._id,
      startDate: pickupDate,
      endDate: dropoffDate,
      pickupLocation: location,
      dropoffLocation: location,
    }));

    if (createBooking.fulfilled.match(bookingResult)) {
      const bookingId = bookingResult.payload._id;
      
      // 2. Initialize Razorpay Payment
      const orderResult = await dispatch(createPaymentOrder(bookingId));
      
      if (createPaymentOrder.fulfilled.match(orderResult)) {
        // 3. Load Razorpay script lazily (only when payment is triggered)
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load payment gateway. Please check your connection and try again.");
          return;
        }

        const options = {
          key: orderResult.payload.key,
          amount: orderResult.payload.amount,
          currency: orderResult.payload.currency,
          name: "LUXORIA",
          description: `Booking: ${orderResult.payload.vehicleName}`,
          order_id: orderResult.payload.orderId,
          handler: function (response) {
            // Forward signature to our backend via navigate state or handle here
            navigate('/booking-success', { 
              state: { paymentResponse: response, bookingId } 
            });
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ""
          },
          theme: {
            color: "#D4AF37" // accent color
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
      }
    }
  };

  return (
    <div className="glass-card-elevated p-8 rounded-3xl sticky top-28">
      <div className="mb-6">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-h3 text-primary">${vehicle?.pricePerDay?.toLocaleString('en-US')}</span>
          <span className="text-body-sm text-secondary mb-1">/ day</span>
        </div>
        <p className="text-caption text-success flex items-center gap-1 font-medium">
          <Info className="w-4 h-4" /> Free cancellation up to 48 hours before
        </p>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>}

      <div className="space-y-4 mb-6">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-primary uppercase">Pickup Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="date" 
                min={today}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-body-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-primary uppercase">Dropoff Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="date" 
                min={pickupDate || today}
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-body-sm outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-caption font-semibold text-primary uppercase">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Pickup & Dropoff City"
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-body-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Calculations */}
      {days > 0 && (
        <div className="border-t border-border pt-4 mb-6 space-y-3">
          <div className="flex justify-between text-body-sm text-secondary">
            <span>${vehicle?.pricePerDay?.toLocaleString('en-US')} x {days} {days === 1 ? 'day' : 'days'}</span>
            <span>${baseTotal.toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between text-body-sm text-secondary">
            <span className="flex items-center gap-1 underline decoration-dashed underline-offset-4 cursor-help">Taxes & Fees (18%)</span>
            <span>${taxes.toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between text-h4 text-primary pt-3 border-t border-border">
            <span>Total</span>
            <span>${grandTotal.toLocaleString('en-US')}</span>
          </div>
        </div>
      )}

      <Button 
        onClick={handleReserve}
        loading={loading}
        className="w-full shadow-lg shadow-accent/20" 
        size="lg" 
        iconRight={ArrowRight}
      >
        Reserve Vehicle
      </Button>

      <p className="text-center text-caption text-muted mt-4">
        You won't be charged until you confirm on the next step.
      </p>
    </div>
  );
}
