import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment, clearBookingState } from '@/redux/slices/bookingSlice';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Home, Car } from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import Button from '@/components/ui/Button';
import jsPDF from 'jspdf';
import { formatDisplayAmount } from '@/utils/currency';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking.currentBooking);

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  // Extract Razorpay response from navigation state
  const { paymentResponse, bookingId } = location.state || {};

  const formatCurrency = (value) => {
    if (value == null) return '—';
    return formatDisplayAmount(value);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const vehicleName = booking?.vehicle ? `${booking.vehicle.brand || ''} ${booking.vehicle.name || ''}`.trim() : 'Luxury Vehicle';
  const guestName = booking?.user?.name || 'Valued Guest';
  const paymentStatus = booking?.status?.toUpperCase() || 'CONFIRMED';

  const downloadReceipt = () => {
    const report = new jsPDF({ unit: 'pt', format: 'a4' });

    report.setFillColor(212, 175, 55);
    report.circle(60, 70, 18, 'F');
    report.setTextColor('#ffffff');
    report.setFontSize(12);
    report.setFont('helvetica', 'bold');
    report.text('L', 54, 75);

    report.setTextColor('#111111');
    report.setFontSize(22);
    report.setFont('helvetica', 'bold');
    report.text('LUXORIA', 100, 60);

    report.setFontSize(10);
    report.setFont('helvetica', 'normal');
    report.text('Luxury Vehicle Concierge', 100, 78);
    report.setDrawColor(212, 175, 55);
    report.setLineWidth(1);
    report.line(40, 95, 555, 95);

    report.setFontSize(16);
    report.setTextColor('#333333');
    report.text('Receipt', 40, 124);
    report.setFontSize(10);
    report.setTextColor('#666666');
    report.text('Thank you for choosing Luxoria. This receipt confirms your premium booking.', 40, 140);

    const details = [
      ['Booking Reference', booking?.bookingId || bookingId || 'N/A'],
      ['Status', booking?.status?.toUpperCase() || 'CONFIRMED'],
      ['Vehicle', vehicleName],
      ['Pickup Date', formatDate(booking?.startDate)],
      ['Dropoff Date', formatDate(booking?.endDate)],
      ['Total Amount', formatCurrency(booking?.totalAmount)],
      ['Pickup Location', booking?.pickupLocation || 'TBD'],
      ['Booked By', guestName],
    ];

    let y = 170;
    report.setFontSize(11);
    report.setTextColor('#222222');
    details.forEach(([label, value]) => {
      report.setFont('helvetica', 'bold');
      report.text(`${label}:`, 40, y);
      report.setFont('helvetica', 'normal');
      report.text(String(value), 170, y);
      y += 22;
    });

    report.setDrawColor(240, 240, 240);
    report.setLineWidth(0.5);
    report.line(40, y + 10, 555, y + 10);
    report.setFontSize(10);
    report.setTextColor('#444444');
    report.text('Luxoria — The world’s finest luxury vehicle experience.', 40, y + 30);
    report.text('Generated on: ' + formatDate(new Date().toISOString()), 40, y + 45);

    report.save(`luxoria_receipt_${booking?.bookingId || bookingId || 'confirmation'}.pdf`);
  };

  useEffect(() => {
    if (!paymentResponse || !bookingId) {
      navigate('/dashboard');
      return;
    }

    const verify = async () => {
      const result = await dispatch(
        verifyPayment({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        })
      );

      if (verifyPayment.fulfilled.match(result)) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.payload || 'Failed to verify payment signature.');
      }
    };

    verify();

    return () => {
      dispatch(clearBookingState());
    };
  }, [dispatch, paymentResponse, bookingId, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}>
          <div className="w-16 h-16 rounded-full border-4 border-[#D4AF37]/40 border-t-[#D4AF37]" />
        </motion.div>
        <p className="text-h4 text-primary mt-8 font-semibold">Finalizing your Luxoria reservation...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 rounded-full bg-[#FDECDC] flex items-center justify-center mb-6 shadow-sm">
          <span className="text-[#DC2626] text-5xl">!</span>
        </div>
        <h1 className="text-3xl font-semibold text-primary mb-4">Payment verification failed</h1>
        <p className="text-base text-secondary mb-8 max-w-xl">{errorMsg || 'There was an issue confirming your transaction. Please try again or contact our concierge service.'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full sm:w-auto">Go to Dashboard</Button>
          <Button variant="outline" onClick={() => navigate('/vehicles')} size="lg" className="w-full sm:w-auto">Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-flex rounded-full bg-[#F9F2DD] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8A7B58]">Premium reservation confirmed</span>
          <h1 className="mt-6 text-4xl lg:text-5xl font-semibold tracking-tight text-primary">Your luxury booking is secured.</h1>
          <p className="mt-4 text-base text-secondary max-w-2xl mx-auto">Luxoria has confirmed your reservation and secured payment through Razorpay. Your curated vehicle experience is now ready to begin.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.85fr] items-start">
          <div className="rounded-[40px] border border-[#ECE6D8] bg-white p-8 shadow-[0_40px_80px_rgba(15,15,15,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#F0E7D5] pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#D4AF37] text-black shadow-glow-gold">
                  <Car className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8A7B58]">LUXORIA</p>
                  <h2 className="text-3xl font-semibold text-primary">Reservation confirmed</h2>
                </div>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#E5D6A9] bg-[#F9F2DD] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8A7B58]">Confirmed</div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              <div className="rounded-[28px] bg-[#FAF7F1] p-6 border border-[#E6DAC2]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7B58] mb-3">Booking reference</p>
                <p className="text-2xl font-semibold text-primary">{booking?.bookingId || bookingId}</p>
              </div>
              <div className="rounded-[28px] bg-[#FAF7F1] p-6 border border-[#E6DAC2]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7B58] mb-3">Amount paid</p>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(booking?.totalAmount)}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="rounded-[28px] border border-[#E6DAC2] bg-[#FEF9F0] p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7B58] mb-3">Vehicle</p>
                <p className="text-xl font-semibold text-primary">{vehicleName}</p>
                <p className="mt-2 text-sm text-secondary">{booking?.vehicle?.category || 'Luxury Fleet'} · {booking?.vehicle?.transmission || 'Automatic'}</p>
              </div>
              <div className="rounded-[28px] border border-[#E6DAC2] bg-[#FEF9F0] p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7B58] mb-3">Trip dates</p>
                <p className="text-xl font-semibold text-primary">{formatDate(booking?.startDate)} → {formatDate(booking?.endDate)}</p>
                <p className="mt-2 text-sm text-secondary">{booking?.pickupLocation || 'Pickup location to be confirmed'}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Button onClick={downloadReceipt} variant="accent" size="lg" className="w-full shadow-glow-gold">
                <Download className="w-4 h-4" /> Download Receipt
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="w-full">
                <Home className="w-4 h-4 mr-2" /> Dashboard
              </Button>
              <Button onClick={() => navigate('/vehicles')} variant="ghost" size="lg" className="w-full">
                <Car className="w-4 h-4 mr-2" /> Explore More
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#ECE6D8] bg-[#0F0F0F] p-8 shadow-[0_45px_90px_rgba(0,0,0,0.12)] text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F4E8C2] text-[#B3871A] shadow-sm">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D0C59A]">Luxoria</p>
                <h3 className="text-2xl font-semibold">Premium itinerary</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] bg-[#161616] p-6 border border-[#2F2F2F]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#BFB38D] mb-3">Guest</p>
                <p className="text-lg font-semibold text-white">{guestName}</p>
                <p className="text-sm text-[#A89C7A] mt-1">{booking?.user?.email || 'No email available'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-[#161616] p-6 border border-[#2F2F2F]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#BFB38D] mb-2">Confirmed On</p>
                  <p className="text-base font-medium text-white">{formatDate(new Date().toISOString())}</p>
                </div>
                <div className="rounded-[28px] bg-[#161616] p-6 border border-[#2F2F2F]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#BFB38D] mb-2">Payment</p>
                  <p className="text-base font-medium text-white">Razorpay</p>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#161616] p-6 border border-[#2F2F2F]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#BFB38D] mb-4">Booking details</p>
                <div className="grid gap-3 text-sm text-[#D8D2BC]">
                  <div className="flex justify-between"><span className="font-medium">Booking ID</span><span>{booking?.bookingId || bookingId}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Vehicle</span><span>{vehicleName}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Duration</span><span>{formatDate(booking?.startDate)} — {formatDate(booking?.endDate)}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Amount</span><span>{formatCurrency(booking?.totalAmount)}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Status</span><span className="uppercase text-[#C9A75D] font-semibold">{paymentStatus}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
