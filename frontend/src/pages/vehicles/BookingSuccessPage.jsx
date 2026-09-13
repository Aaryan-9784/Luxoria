import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment, clearBookingState } from '@/redux/slices/bookingSlice';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Download, Car,
  MapPin, CalendarDays, CreditCard, Hash, Shield, ArrowRight, Package
} from 'lucide-react';
import { EASE_LUXE } from '@/lib/motion';
import { formatDisplayAmount, convertUsdToInr, USD_TO_INR_RATE } from '@/utils/currency';
import { openLuxoriaReceipt } from '@/utils/generateReceipt';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const booking   = useSelector(s => s.booking.currentBooking);
  const verificationStarted = React.useRef(false);

  const [status,   setStatus]   = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  const { paymentResponse, bookingId } = location.state || {};

  /* ── helpers ── */
  const fmt = v => (v == null ? '—' : formatDisplayAmount(v));

  // Shows: $2,500 (₹2,38,050)
  const fmtDual = v => {
    if (v == null) return '—';
    const usd = Number(v);
    const inr = convertUsdToInr(usd);
    const usdStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usd);
    const inrStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inr);
    return { usd: usdStr, inr: inrStr };
  };
  const fmtDate = iso =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const vehicleName = booking?.vehicle
    ? `${booking.vehicle.brand || ''} ${booking.vehicle.name || ''}`.trim()
    : 'Luxury Vehicle';
  const vehicleImg  = booking?.vehicle?.images?.[0]?.url || null;
  const guestName   = booking?.user?.name  || 'Valued Guest';
  const guestEmail  = booking?.user?.email || '';
  const bookingRef     = booking?.bookingId   || bookingId || '—';
  const payStatus      = booking?.status?.toUpperCase() || 'CONFIRMED';
  const tripDays       = booking?.totalDays ?? '—';


  /* ── PDF download — browser print ── */
  const downloadReceipt = () => {
    const fmtShort = (iso) => iso
      ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

    openLuxoriaReceipt({
      bookingRef:          bookingRef,
      dateIssued:          fmtShort(new Date().toISOString()),
      tripStart:           fmtShort(booking?.startDate),
      tripEnd:             fmtShort(booking?.endDate),
      totalDays:           booking?.totalDays ?? 1,
      pickupLocation:      booking?.pickupLocation || 'To be confirmed',
      guestName:           guestName,
      guestEmail:          guestEmail,
      vehicleName:         vehicleName,
      vehicleBrand:        booking?.vehicle?.brand || '',
      vehicleTransmission: booking?.vehicle?.transmission
        ? booking.vehicle.transmission.charAt(0).toUpperCase() + booking.vehicle.transmission.slice(1)
        : 'Automatic',
      amountUsd:           booking?.totalAmount ?? 0,
      amountInr:           convertUsdToInr(booking?.totalAmount ?? 0),
    });
  };

  /* ── verify payment on mount ── */
  useEffect(() => {
    if (!paymentResponse || !bookingId) { navigate('/dashboard'); return; }
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verify = async () => {
      const result = await dispatch(verifyPayment({
        razorpay_order_id:   paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature:  paymentResponse.razorpay_signature,
      }));

      if (verifyPayment.fulfilled.match(result)) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.payload || 'Failed to verify payment signature.');
      }
    };

    verify();
    return () => { dispatch(clearBookingState()); };
  }, [dispatch, paymentResponse, bookingId, navigate]);

  /* ════════════════════════ VERIFYING ════════════════════════ */
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-[3px] border-[#ECECEC] border-t-[#C9A75D]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 bg-[#0F0F0F] rounded-full flex items-center justify-center shadow-sm">
              <Car className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-primary font-semibold text-base">Finalizing your reservation…</p>
          <p className="text-secondary text-sm mt-1">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════ ERROR ════════════════════════ */
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 gap-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <span className="text-red-500 text-3xl font-light">!</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Payment Verification Failed</h1>
          <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
            {errorMsg || 'There was an issue confirming your transaction. Please contact our concierge team.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 rounded-xl bg-[#0F0F0F] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-8 py-3 rounded-xl border border-[#ECECEC] text-primary text-sm font-bold uppercase tracking-widest hover:border-[#0F0F0F] transition-colors"
          >
            Browse Fleet
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════ SUCCESS ════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_LUXE }}
      className="min-h-screen bg-background pt-24 pb-20"
    >
      <div className="container-luxe">

        {/* ── Top Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A75D] mb-6 shadow-[0_8px_32px_rgba(201,167,93,0.35)]"
          >
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: EASE_LUXE }}
            className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A75D] mb-3"
          >
            Premium Reservation Confirmed
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: EASE_LUXE }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F0F0F] tracking-tight"
          >
            Your luxury booking is secured.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45, ease: EASE_LUXE }}
            className="mt-3 text-[#666666] text-base max-w-lg mx-auto leading-relaxed"
          >
            Luxoria has confirmed your reservation and secured payment through Razorpay.
            Your curated vehicle experience is now ready to begin.
          </motion.p>
        </div>

        {/* ── Two-column layout ────────────────────────────────────────── */}
        <div className="grid gap-6 xl:grid-cols-[1fr_400px] items-start">

          {/* ── LEFT CARD ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: EASE_LUXE }}
            className="bg-white border border-[#ECECEC] rounded-3xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#ECECEC]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A75D] flex items-center justify-center shadow-[0_4px_16px_rgba(201,167,93,0.3)]">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#666666]">Luxoria</p>
                  <h2 className="text-xl font-bold text-[#0F0F0F] tracking-tight">Reservation Confirmed</h2>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-[#F9F2DD] border border-[#E5D6A9] text-[#8A7B58] text-[10px] font-bold uppercase tracking-[0.2em]">
                {payStatus}
              </span>
            </div>

            {/* Vehicle image — always shown, fallback gradient if no image */}
            <div className="relative h-64 overflow-hidden shrink-0">
              {vehicleImg ? (
                <img
                  src={vehicleImg}
                  alt={vehicleName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F5F0E8] via-[#EDE3D0] to-[#E0D4BA] flex items-center justify-center">
                  <Car className="w-24 h-24 text-[#C9A75D]/30" />
                </div>
              )}
              {/* Always-on overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Vehicle name overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-7 py-5">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
                  {booking?.vehicle?.category || 'Luxury Fleet'} · {booking?.vehicle?.transmission || 'Automatic'}
                </p>
                <p className="text-white text-2xl font-bold tracking-tight">{vehicleName}</p>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {/* Booking Ref */}
              <div className="bg-[#FAF7F1] border border-[#E6DAC2] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-3.5 h-3.5 text-[#C9A75D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A7B58]">Booking Reference</p>
                </div>
                <p className="text-xl font-bold text-[#0F0F0F] font-mono">{bookingRef}</p>
              </div>

              {/* Amount */}
              <div className="bg-[#FAF7F1] border border-[#E6DAC2] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#C9A75D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A7B58]">Amount Paid</p>
                </div>
                <p className="text-xl font-bold text-[#0F0F0F]">{fmtDual(booking?.totalAmount).usd}</p>
                <p className="text-sm text-[#8A7B58] mt-0.5">({fmtDual(booking?.totalAmount).inr})</p>
              </div>

              {/* Dates */}
              <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#C9A75D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666666]">Trip Dates</p>
                </div>
                <p className="text-base font-bold text-[#0F0F0F]">
                  {fmtDate(booking?.startDate)} → {fmtDate(booking?.endDate)}
                </p>
                {tripDays !== '—' && (
                  <p className="text-sm text-[#666666] mt-0.5">{tripDays} day{tripDays !== 1 ? 's' : ''}</p>
                )}
              </div>

              {/* Location */}
              <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A75D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666666]">Pickup Location</p>
                </div>
                <p className="text-base font-bold text-[#0F0F0F]">
                  {booking?.pickupLocation || 'To be confirmed'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-5">
              <button
                onClick={downloadReceipt}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C9A75D] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#B59345] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(201,167,93,0.3)] hover:shadow-[0_6px_24px_rgba(201,167,93,0.4)]"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                onClick={() => navigate('/vehicles')}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#ECECEC] text-[#666666] text-[11px] font-bold uppercase tracking-widest hover:border-[#0F0F0F] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] active:scale-[0.98] transition-all"
              >
                <Car className="w-4 h-4" />
                Explore More
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-3 mx-6 mb-6 px-4 py-3 rounded-xl bg-[#F5F5F5] border border-[#ECECEC]">
              <Shield className="w-4 h-4 text-[#C9A75D] shrink-0" />
              <p className="text-[12px] text-[#666666]">
                Your payment is <span className="font-semibold text-[#0F0F0F]">100% secure</span> — processed via <span className="font-semibold text-[#0F0F0F]">Razorpay</span> with bank-level encryption. Luxoria never stores your card details.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT CARD — Dark Itinerary ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: EASE_LUXE }}
            className="bg-[#0F0F0F] border border-[#1E1E1E] rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-7 py-6 border-b border-white/[0.07]">
              <div className="w-10 h-10 rounded-xl bg-[#C9A75D]/15 border border-[#C9A75D]/20 flex items-center justify-center">
                <Car className="w-4.5 h-4.5 text-[#C9A75D]" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/30 mb-0.5">Luxoria</p>
                <h3 className="text-white text-base font-bold tracking-tight">Premium Itinerary</h3>
              </div>
            </div>

            {/* Guest */}
            <div className="px-7 py-5 border-b border-white/[0.07]">
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/30 mb-3">Guest</p>
              <p className="text-white font-bold text-[15px]">{guestName}</p>
              <p className="text-white/40 text-xs mt-0.5">{guestEmail || 'No email on file'}</p>
            </div>

            {/* Confirmed / Payment row */}
            <div className="grid grid-cols-2 divide-x divide-white/[0.07] border-b border-white/[0.07]">
              <div className="px-7 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 mb-1.5">Confirmed On</p>
                <p className="text-white text-sm font-semibold">{fmtDate(new Date().toISOString())}</p>
              </div>
              <div className="px-7 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 mb-1.5">Payment</p>
                <p className="text-white text-sm font-semibold">Razorpay</p>
              </div>
            </div>

            {/* Booking detail rows */}
            <div className="px-7 py-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/30 mb-4">Booking Details</p>
              <div className="space-y-0">
                {[
                  { label: 'Booking ID', value: bookingRef },
                  { label: 'Vehicle',    value: vehicleName },
                  { label: 'Duration',   value: `${fmtDate(booking?.startDate)} — ${fmtDate(booking?.endDate)}` },
                  { label: 'Amount',     value: `${fmtDual(booking?.totalAmount).usd} (${fmtDual(booking?.totalAmount).inr})` },
                  { label: 'Status',     value: payStatus, gold: true },
                ].map(({ label, value, gold }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0"
                  >
                    <span className="text-[11px] font-semibold text-white/40">{label}</span>
                    <span className={`text-[12px] font-bold text-right max-w-[55%] ${gold ? 'text-[#C9A75D]' : 'text-white'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard CTA */}
            <div className="px-7 pb-7">
              <button
                onClick={() => navigate('/dashboard')}
                className="group w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.09] hover:bg-white/[0.09] hover:border-[#C9A75D]/40 active:scale-[0.98] transition-all"
              >
                <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                  View in Dashboard
                </span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A75D]/50 group-hover:bg-[#C9A75D]/10 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C9A75D] transition-colors" />
                </div>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
