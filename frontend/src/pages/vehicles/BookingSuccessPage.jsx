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
  const upgradeDetails = booking?.notes?.trim() || 'No upgrades selected';

  /* ── PDF download — browser print ── */
  const downloadReceipt = () => {
    const usd = fmtDual(booking?.totalAmount).usd;
    const inr = fmtDual(booking?.totalAmount).inr;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Luxoria Receipt — ${bookingRef}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fff;
      color: #0F0F0F;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 794px;
      max-height: 1123px;
      margin: 0 auto;
      background: #fff;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    .header {
      background: #0F0F0F;
      padding: 18px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #C9A75D;
    }
    .brand-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px; font-weight: 700;
      color: #fff; letter-spacing: 5px;
      text-transform: uppercase; line-height: 1;
    }
    .brand-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 8.5px; font-weight: 400;
      color: #C9A75D; letter-spacing: 3.5px;
      text-transform: uppercase; margin-top: 5px;
    }
    .header-right { text-align: right; }
    .receipt-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 600;
      color: #C9A75D; letter-spacing: 3.5px;
      text-transform: uppercase; margin-bottom: 4px;
    }
    .receipt-meta {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; color: rgba(255,255,255,0.5);
      line-height: 1.8; font-weight: 300;
    }
    .receipt-meta strong { color: rgba(255,255,255,0.85); font-weight: 500; }
    .status-pill {
      display: inline-block;
      margin-top: 8px;
      background: #C9A75D;
      color: #0F0F0F;
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 4px 12px; border-radius: 50px;
    }

    /* ── Billed To / Vehicle strip ── */
    .summary-strip {
      background: #FAF7F1;
      border-bottom: 1px solid #E6DAC2;
      padding: 16px 40px;
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      gap: 0;
    }
    .summary-divider { background: #E6DAC2; }
    .summary-col { padding: 0 22px; }
    .summary-col:first-child { padding-left: 0; }
    .summary-col:last-child  { padding-right: 0; }
    .summary-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 600;
      color: #8A7B58; letter-spacing: 3px;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .summary-name  {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 15px; font-weight: 600; color: #0F0F0F; line-height: 1.3;
    }
    .summary-sub   {
      font-family: 'DM Sans', sans-serif;
      font-size: 10.5px; color: #666; margin-top: 3px; line-height: 1.6; font-weight: 300;
    }

    /* ── Body ── */
    .body { padding: 20px 40px; flex: 1; }

    .section-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 600;
      color: #888; letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #ECECEC;
    }
    thead tr { background: #0F0F0F; }
    thead th {
      font-family: 'DM Sans', sans-serif;
      padding: 9px 14px;
      font-size: 8px; font-weight: 600;
      color: #fff; letter-spacing: 2.5px;
      text-transform: uppercase; text-align: left;
    }
    thead th:last-child { text-align: right; }
    tbody tr:nth-child(even) { background: #F9F7F2; }
    tbody tr:nth-child(odd)  { background: #fff; }
    tbody td {
      font-family: 'DM Sans', sans-serif;
      padding: 9px 14px;
      font-size: 11.5px; color: #555;
      border-bottom: 1px solid #F0F0F0;
      font-weight: 300;
    }
    tbody td:last-child {
      text-align: right;
      font-weight: 600; color: #0F0F0F;
    }
    tbody tr:last-child td { border-bottom: none; }

    /* ── Amount box ── */
    .amount-box {
      background: #0F0F0F;
      border-radius: 10px;
      padding: 18px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      border-left: 4px solid #C9A75D;
    }
    .amount-left {}
    .amount-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 600;
      color: #8A7B58; letter-spacing: 3px;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .amount-usd {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px; font-weight: 700;
      color: #fff; line-height: 1;
    }
    .amount-inr {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 400;
      color: #C9A75D; margin-top: 4px;
    }
    .amount-right { text-align: right; }
    .payment-badge {
      display: inline-block;
      background: rgba(201,167,93,0.15);
      border: 1px solid rgba(201,167,93,0.4);
      color: #C9A75D;
      font-family: 'DM Sans', sans-serif;
      font-size: 8px; font-weight: 600;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 7px 16px; border-radius: 50px;
      margin-bottom: 8px;
    }
    .payment-via {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 300;
    }
    .payment-via strong { color: rgba(255,255,255,0.65); font-weight: 500; }

    /* ── Note box ── */
    .note-box {
      background: #FFFBF0;
      border: 1px solid #E6DAC2;
      border-left: 3px solid #C9A75D;
      border-radius: 8px;
      padding: 10px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; color: #666; line-height: 1.6; font-weight: 300;
      margin-bottom: 16px;
    }
    .note-box strong { color: #0F0F0F; font-weight: 600; }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #ECECEC;
      padding: 14px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FAFAFA;
    }
    .footer-left { }
    .footer-brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 13px; font-weight: 700;
      color: #0F0F0F; letter-spacing: 3px;
      text-transform: uppercase;
    }
    .footer-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 9px; color: #aaa; margin-top: 2px; font-weight: 300; letter-spacing: 0.5px;
    }
    .footer-right { text-align: right; }
    .footer-note {
      font-family: 'DM Sans', sans-serif;
      font-size: 9px; color: #aaa; line-height: 1.7; font-weight: 300;
    }
    .footer-page {
      font-family: 'DM Sans', sans-serif;
      text-align: center;
      font-size: 8.5px; color: #ccc;
      margin-top: 4px;
      letter-spacing: 1px;
    }

    /* ── Gold accent line at bottom ── */
    .gold-bottom { height: 3px; background: linear-gradient(90deg, #C9A75D, #E8D090, #C9A75D); }

    @media print {
      body { margin: 0; }
      .page { width: 100%; box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">Luxoria</div>
      <div class="brand-sub">Luxury Vehicle Concierge</div>
    </div>
    <div class="header-right">
      <div class="receipt-label">Payment Receipt</div>
      <div class="receipt-meta">
        <strong>REF</strong> &nbsp;${bookingRef}<br/>
        <strong>DATE</strong> &nbsp;${fmtDate(new Date().toISOString())}
      </div>
      <span class="status-pill">&#10003; &nbsp;Confirmed</span>
    </div>
  </div>

  <!-- Summary strip -->
  <div class="summary-strip">
    <div class="summary-col">
      <div class="summary-label">Billed To</div>
      <div class="summary-name">${guestName}</div>
      <div class="summary-sub">
        ${guestEmail || 'N/A'}<br/>
        ${booking?.pickupLocation || 'Location TBD'}
      </div>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-col">
      <div class="summary-label">Vehicle</div>
      <div class="summary-name">${vehicleName}</div>
      <div class="summary-sub">
        ${booking?.vehicle?.category ? booking.vehicle.category.charAt(0).toUpperCase() + booking.vehicle.category.slice(1) : 'Luxury Fleet'}
        &nbsp;&middot;&nbsp;
        ${booking?.vehicle?.transmission ? booking.vehicle.transmission.charAt(0).toUpperCase() + booking.vehicle.transmission.slice(1) : 'Automatic'}
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">

    <div class="section-label">Booking Details</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Booking Reference</td><td>${bookingRef}</td></tr>
        <tr><td>Trip Period</td><td>${fmtDate(booking?.startDate)} &rarr; ${fmtDate(booking?.endDate)}</td></tr>
        <tr><td>Duration</td><td>${tripDays} day${tripDays !== 1 ? 's' : ''}</td></tr>
        <tr><td>Pickup Location</td><td>${booking?.pickupLocation || 'To be confirmed'}</td></tr>
        <tr><td>Payment Method</td><td>Razorpay &mdash; Online</td></tr>
        <tr><td>Confirmed On</td><td>${fmtDate(new Date().toISOString())}</td></tr>
      </tbody>
    </table>

    <!-- Amount box -->
    <div class="amount-box">
      <div class="amount-left">
        <div class="amount-label">Total Amount Paid</div>
        <div class="amount-usd">${usd}</div>
        <div class="amount-inr">&#8776; ${inr}</div>
      </div>
      <div class="amount-right">
        <div class="payment-badge">&#10003; &nbsp;Payment Captured</div>
        <div class="payment-via">Processed via <strong>Razorpay</strong></div>
      </div>
    </div>

    <!-- Note -->
    <div class="note-box">
      <strong>Important:</strong> This is your official payment receipt for booking
      <strong>${bookingRef}</strong>. Please retain this document for your records.
      For any queries, contact us at <strong>support@luxoria.in</strong>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <div class="footer-brand">Luxoria</div>
      <div class="footer-sub">Luxury Vehicle Concierge &nbsp;&middot;&nbsp; luxoria.in</div>
    </div>
    <div class="footer-page">Page 1 of 1</div>
    <div class="footer-right">
      <div class="footer-note">
        This is an official payment receipt.<br/>
        For support: support@luxoria.in
      </div>
    </div>
  </div>

  <div class="gold-bottom"></div>
</div>

<script>
  window.onload = function() {
    window.print();
    window.onafterprint = function() { window.close(); };
  };
</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
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
            <span className="text-[#C9A75D] text-sm font-bold">L</span>
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

              {/* Upgrade details */}
              <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-3.5 h-3.5 text-[#C9A75D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666666]">Upgrade Details</p>
                </div>
                <p className="text-base font-bold text-[#0F0F0F]">
                  {upgradeDetails}
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
