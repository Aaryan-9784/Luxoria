import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { createPaymentOrder } from '@/redux/slices/bookingSlice';
import { convertUsdToInr } from '@/utils/currency';
import { openLuxoriaReceipt } from '@/utils/generateReceipt';
import {
  CreditCard, ShieldCheck, Download, Hash,
  CalendarDays, DollarSign, ChevronLeft, ChevronRight,
  Car, TrendingUp, Receipt, ExternalLink, Clock, AlertCircle, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';

const STATUS_STYLE = {
  confirmed: { label: 'Paid',      color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10', border: 'border-[#16A34A]/20' },
  completed: { label: 'Completed', color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10', border: 'border-[#16A34A]/20' },
  pending:   { label: 'Pending',   color: 'text-[#C9A75D]', bg: 'bg-[#C9A75D]/10', border: 'border-[#C9A75D]/20' },
  active:    { label: 'Active',    color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20' },
  cancelled: { label: 'Refunded',  color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/10', border: 'border-[#DC2626]/20' },
};

/** Lazily inject Razorpay checkout script only when needed */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentsDashboard() {
  const { accessToken, user, loading: authLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [payingId, setPayingId] = useState(null);   // booking._id currently being paid
  const [payError, setPayError] = useState('');
  const itemsPerPage = 8;

  // ── Fetch all bookings (paid + pending) ───────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) { setLoading(false); return; }
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await api.get('/bookings/my?limit=100');
        const raw = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setBookings(raw.filter(b => b.status !== 'cancelled' && b.totalAmount > 0));
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken, authLoading]);

  // ── Timeframe filter + sort ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date();
    return bookings
      .filter(b => {
        if (timeframe === 'all') return true;
        const d = new Date(b.createdAt);
        if (timeframe === 'month')
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (timeframe === 'year') return d.getFullYear() === now.getFullYear();
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, timeframe]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const paidBookings = filtered.filter(b =>
    ['confirmed', 'completed', 'active'].includes(b.status)
  );
  const totalSpent = paidBookings.reduce((s, b) => s + b.totalAmount, 0);
  const avgPerRental = paidBookings.length > 0
    ? Math.round(totalSpent / paidBookings.length)
    : 0;
  const pendingCount = filtered.filter(b => b.status === 'pending').length;

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated  = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // ── Download receipt ─────────────────────────────────────────────────────
  const handleDownload = (b) => {
    const fmt = (iso) => iso
      ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';
    openLuxoriaReceipt({
      bookingRef:          b.bookingId,
      dateIssued:          fmt(b.createdAt),
      tripStart:           fmt(b.startDate),
      tripEnd:             fmt(b.endDate),
      totalDays:           b.totalDays,
      pickupLocation:      b.pickupLocation || 'N/A',
      guestName:           user?.name  || 'Guest',
      guestEmail:          user?.email || '',
      vehicleName:         b.vehicle?.name  || 'Luxury Vehicle',
      vehicleBrand:        b.vehicle?.brand || '',
      vehicleTransmission: b.vehicle?.transmission
        ? b.vehicle.transmission.charAt(0).toUpperCase() + b.vehicle.transmission.slice(1)
        : 'Automatic',
      amountUsd:           b.totalAmount ?? 0,
      amountInr:           convertUsdToInr(b.totalAmount ?? 0),
    });
  };

  // ── Pay Now (Razorpay retry for pending bookings) ─────────────────────────
  const handlePayNow = async (booking) => {
    setPayingId(booking._id);
    setPayError('');
    try {
      const orderResult = await dispatch(createPaymentOrder(booking._id));
      if (!createPaymentOrder.fulfilled.match(orderResult)) {
        setPayError(orderResult.payload || 'Failed to initialize payment.');
        return;
      }
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPayError('Payment gateway failed to load. Check your connection and try again.');
        return;
      }
      const { key, amount, currency, orderId, vehicleName } = orderResult.payload;
      const options = {
        key,
        amount,
        currency,
        name: 'LUXORIA',
        description: `Booking: ${vehicleName}`,
        order_id: orderId,
        handler: (response) => {
          navigate('/booking-success', {
            state: { paymentResponse: response, bookingId: booking._id },
          });
        },
        prefill: {
          name: user?.name  || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#C9A75D' },
        modal: {
          ondismiss: () => setPayingId(null),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setPayError('Payment failed: ' + resp.error.description);
        setPayingId(null);
      });
      rzp.open();
    } catch {
      setPayError('Something went wrong. Please try again.');
    } finally {
      setPayingId(null);
    }
  };


  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1
            className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Payments
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">
            Your complete transaction history and payment records.
          </p>
        </div>
        {bookings.length > 0 && (
          <div className="w-full sm:w-48">
            <CustomSelect
              value={timeframe}
              onChange={(v) => { setTimeframe(v); setCurrentPage(1); }}
              icon={CalendarDays}
              options={[
                { value: 'all',   label: 'All Time' },
                { value: 'month', label: 'This Month' },
                { value: 'year',  label: 'This Year' },
              ]}
            />
          </div>
        )}
      </div>

      {/* Pending payments alert banner */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-[#C9A75D]/10 border border-[#C9A75D]/30"
          >
            <div className="w-9 h-9 rounded-full bg-[#C9A75D]/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#C9A75D]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#0F0F0F]">
                {pendingCount} booking{pendingCount > 1 ? 's' : ''} awaiting payment
              </p>
              <p className="text-[12px] text-[#666666] mt-0.5">
                Complete your payment to confirm your reservation.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay error toast */}
      <AnimatePresence>
        {payError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20"
          >
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <p className="flex-1 text-[13px] font-medium text-[#DC2626]">{payError}</p>
            <button onClick={() => setPayError('')} className="text-[#DC2626] hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Stats */}
      {paidBookings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: DollarSign, label: 'Total Spent',     value: `$${totalSpent.toLocaleString('en-US')}` },
            { icon: Receipt,    label: 'Transactions',    value: paidBookings.length },
            { icon: TrendingUp, label: 'Avg. Per Rental', value: avgPerRental > 0 ? `$${avgPerRental.toLocaleString('en-US')}` : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-[#ECECEC] rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C9A75D]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">{label}</p>
                <p className="text-[16px] font-bold text-[#0F0F0F]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#ECECEC] rounded-2xl">
          <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">
            Loading Payments...
          </p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-[#ECECEC] rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <CreditCard className="w-9 h-9 text-[#C9A75D] opacity-60" />
          </div>
          <h2
            className="text-2xl font-bold text-[#0F0F0F] mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            No Payments Yet
          </h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            Once you complete a booking, your payment history will appear here.
          </p>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-all"
          >
            <Car className="w-4 h-4" /> Browse Fleet
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">

          {/* Zero in current timeframe */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
              <Receipt className="w-10 h-10 text-[#ECECEC]" />
              <p className="text-[13px] text-[#666666]">No payments in this timeframe.</p>
              <button
                onClick={() => setTimeframe('all')}
                className="text-[12px] font-bold text-[#C9A75D] hover:underline"
              >
                View All Time →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                    {['Date', 'Reference', 'Vehicle', 'Duration', 'Status', 'Amount', ''].map(h => (
                      <th
                        key={h}
                        className="py-4 px-5 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECEC]">
                  {paginated.map(b => {
                    const st        = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                    const isPaid    = ['confirmed', 'completed', 'active'].includes(b.status);
                    const isPending = b.status === 'pending';
                    const isPaying  = payingId === b._id;

                    return (
                      <tr key={b._id} className="hover:bg-[#F9F9F9] transition-colors group">

                        {/* Date */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2 text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                            <CalendarDays className="w-3.5 h-3.5 text-[#999999]" />
                            {new Date(b.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </div>
                        </td>

                        {/* Reference */}
                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#ECECEC] bg-[#F9F9F9] text-[11px] font-mono font-bold text-[#666666] whitespace-nowrap">
                            <Hash className="w-3 h-3 text-[#C9A75D]" />
                            {b.bookingId?.substring(0, 8).toUpperCase()}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {b.vehicle?.images?.[0]?.url && (
                              <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F0F0F0]">
                                <img
                                  src={b.vehicle.images[0].url}
                                  alt={b.vehicle.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">
                              {b.vehicle?.name || 'Vehicle'}
                            </p>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-5">
                          <p className="text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                            {b.totalDays} day{b.totalDays !== 1 ? 's' : ''}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${st.color} ${st.bg} ${st.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${st.color.replace('text-', 'bg-')} ${isPending ? 'animate-pulse' : ''}`} />
                            {st.label}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-5">
                          <p className="text-[14px] font-bold text-[#0F0F0F] whitespace-nowrap">
                            ${b.totalAmount?.toLocaleString('en-US')}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-end gap-2">

                            {/* View booking detail */}
                            <Link
                              to={`/bookings/${b._id}`}
                              className="p-2 rounded-lg text-[#666666] hover:text-[#0F0F0F] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all"
                              title="View Booking"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Download receipt — only for paid bookings */}
                            {isPaid && (
                              <button
                                onClick={() => handleDownload(b)}
                                className="p-2 rounded-lg text-[#666666] hover:text-[#C9A75D] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all"
                                title="Download Receipt"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}

                            {/* Pay Now — only for pending bookings */}
                            {isPending && (
                              <button
                                onClick={() => handlePayNow(b)}
                                disabled={isPaying}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F0F0F] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-all disabled:opacity-60 whitespace-nowrap"
                                title="Complete Payment"
                              >
                                {isPaying ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Pay Now
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-[#ECECEC] p-4 flex items-center justify-between bg-[#F9F9F9]">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#ECECEC] bg-white disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${
                      currentPage === i + 1 ? 'bg-[#0F0F0F] text-white' : 'text-[#666666] hover:bg-[#ECECEC]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#ECECEC] bg-white disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#ECECEC] shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#FBFBFB] border border-[#ECECEC] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#C9A75D]" />
        </div>
        <div className="mt-0.5">
          <h4 className="text-[14px] font-bold text-[#0F0F0F] mb-1">Secure Payments via Razorpay</h4>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            All transactions are processed through{' '}
            <span className="text-[#C9A75D] font-medium">Razorpay</span> with bank-level encryption.
            Luxoria never stores your card details directly.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
