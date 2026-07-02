import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking } from '@/redux/slices/dashboardSlice';
import { createReview, fetchMyReviews } from '@/redux/slices/reviewSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CalendarDays, MapPin, Hash, Car, Download,
  X, CheckCircle2, Clock, AlertTriangle, Ban, Star,
  User, Phone, Mail, CreditCard, Package, MessageSquare, Check
} from 'lucide-react';

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`transition-transform ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className={`${sz} transition-colors ${
              star <= (hovered || value)
                ? 'text-[#C9A75D] fill-[#C9A75D]'
                : 'text-[#ECECEC] fill-[#ECECEC]'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#C9A75D', bg: 'bg-[#C9A75D]/10',   border: 'border-[#C9A75D]/20',   icon: Clock },
  confirmed: { label: 'Confirmed', color: '#3B82F6', bg: 'bg-[#3B82F6]/10',   border: 'border-[#3B82F6]/20',   icon: CheckCircle2 },
  active:    { label: 'Active',    color: '#16A34A', bg: 'bg-[#16A34A]/10',   border: 'border-[#16A34A]/20',   icon: CheckCircle2 },
  completed: { label: 'Completed', color: '#16A34A', bg: 'bg-[#16A34A]/10',   border: 'border-[#16A34A]/20',   icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: 'bg-[#DC2626]/10',   border: 'border-[#DC2626]/20',   icon: Ban },
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Review state
  const { reviews } = useSelector(state => state.reviews);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data.booking);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
    // Also ensure reviews are loaded so we can check if already reviewed
    dispatch(fetchMyReviews());
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    const result = await dispatch(cancelBooking({ id: booking._id, reason: 'User requested cancellation' }));
    if (cancelBooking.fulfilled.match(result)) {
      // Merge the updated booking fields (status, cancellationReason) with existing populated data
      setBooking(prev => ({ ...prev, ...result.payload }));
    }
    setCancelling(false);
    setCancelModalOpen(false);
  };

  // Check if user already reviewed this vehicle from this booking
  const hasReview = booking
    ? reviews.some(r => r.booking === booking._id || r.booking?._id === booking._id)
    : false;

  const handleReviewSubmit = async () => {
    if (!reviewComment.trim()) { setReviewError('Please write a comment.'); return; }
    setReviewSaving(true);
    setReviewError('');
    const result = await dispatch(
      createReview({
        vehicleId: booking.vehicle._id,
        bookingId: booking._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
    );
    setReviewSaving(false);
    if (createReview.fulfilled.match(result)) {
      setReviewSuccess(true);
      setReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
      dispatch(fetchMyReviews());
    } else {
      setReviewError(result.payload || 'Failed to submit review.');
    }
  };

  const handleDownloadReceipt = () => {
    if (!booking) return;
    const lines = [
      '================================================',
      '           LUXORIA — RENTAL RECEIPT             ',
      '================================================',
      '',
      `Booking ID    : ${booking.bookingId}`,
      `Vehicle       : ${booking.vehicle?.name || 'N/A'}`,
      `Brand         : ${booking.vehicle?.brand || 'N/A'}`,
      `Category      : ${booking.vehicle?.category || 'N/A'}`,
      '',
      `Pick-up       : ${new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Drop-off      : ${new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Total Days    : ${booking.totalDays}`,
      '',
      `Pickup Loc.   : ${booking.pickupLocation || 'N/A'}`,
      `Dropoff Loc.  : ${booking.dropoffLocation || 'N/A'}`,
      '',
      `Status        : ${booking.status?.toUpperCase()}`,
      `Total Amount  : $${booking.totalAmount?.toLocaleString('en-US')}`,
      '',
      booking.notes ? `Notes         : ${booking.notes}` : '',
      '',
      '================================================',
      '     Thank you for choosing Luxoria.            ',
      '================================================',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Luxoria_Receipt_${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[13px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-[#DC2626] mb-4" />
        <p className="text-[15px] font-bold text-[#0F0F0F] mb-2">Unable to Load Booking</p>
        <p className="text-[13px] text-[#666666] mb-6">{error}</p>
        <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F0F0F] text-white text-[13px] font-bold hover:bg-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) return null;

  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canDownload = ['completed', 'confirmed', 'active'].includes(booking.status);
  const canReview = booking.status === 'completed' && !hasReview && !reviewSuccess;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">

      {/* Back + Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center gap-2 text-[#666666] hover:text-[#0F0F0F] text-[13px] font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Bookings
        </button>
        <div className="flex items-center gap-3">
          {canDownload && (
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ECECEC] text-[#666666] hover:text-[#C9A75D] hover:border-[#C9A75D]/40 text-[12px] font-bold transition-all"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
          )}
          {canReview && (
            <button
              onClick={() => { setReviewModal(true); setReviewError(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C9A75D]/30 bg-[#C9A75D]/10 text-[#C9A75D] hover:bg-[#C9A75D]/20 text-[12px] font-bold transition-all"
            >
              <Star className="w-4 h-4" /> Leave a Review
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/5 text-[12px] font-bold transition-all"
            >
              <X className="w-4 h-4" /> Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${status.bg} ${status.border}`}>
        <StatusIcon className="w-5 h-5 shrink-0" style={{ color: status.color }} />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: status.color }}>
            Booking {status.label}
          </p>
          <p className="text-[12px] text-[#666666] mt-0.5">
            {booking.status === 'pending' && 'Your reservation is awaiting vendor confirmation.'}
            {booking.status === 'confirmed' && 'Your reservation has been confirmed by the vendor.'}
            {booking.status === 'active' && 'Your rental is currently active. Enjoy your drive!'}
            {booking.status === 'completed' && 'This rental has been completed. We hope you enjoyed the experience.'}
            {booking.status === 'cancelled' && `Cancelled${booking.cancellationReason ? `: ${booking.cancellationReason}` : '.'}`}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/50 shadow-sm">
            <Hash className="w-3 h-3 text-[#C9A75D]" />
            <span className="text-[11px] font-mono font-bold text-[#0F0F0F]">{booking.bookingId}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vehicle Card */}
        <div className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm">
          <div className="relative h-52 bg-[#F5F5F5]">
            {booking.vehicle?.images?.[0]?.url ? (
              <img
                src={booking.vehicle.images[0].url}
                alt={booking.vehicle.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-16 h-16 text-[#CCCCCC]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 text-white">
              <p className="text-[20px] font-bold leading-tight">{booking.vehicle?.name}</p>
              <p className="text-[12px] text-white/70 mt-0.5">{booking.vehicle?.brand} · {booking.vehicle?.category}</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0]">
                <CalendarDays className="w-4 h-4 text-[#C9A75D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">Pick-up Date</p>
                  <p className="text-[13px] font-bold text-[#0F0F0F] mt-0.5">
                    {new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0]">
                <CalendarDays className="w-4 h-4 text-[#C9A75D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">Drop-off Date</p>
                  <p className="text-[13px] font-bold text-[#0F0F0F] mt-0.5">
                    {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0]">
                <MapPin className="w-4 h-4 text-[#C9A75D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">Pickup Location</p>
                  <p className="text-[13px] font-bold text-[#0F0F0F] mt-0.5">{booking.pickupLocation || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0]">
                <MapPin className="w-4 h-4 text-[#C9A75D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">Dropoff Location</p>
                  <p className="text-[13px] font-bold text-[#0F0F0F] mt-0.5">{booking.dropoffLocation || '—'}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="p-3 rounded-xl bg-[#FFFBF0] border border-[#C9A75D]/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9A75D] mb-1">Special Requests</p>
                <p className="text-[13px] text-[#444444]">{booking.notes}</p>
              </div>
            )}

            {/* Leave a Review prompt */}
            {canReview && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#C9A75D]/5 border border-[#C9A75D]/20">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#C9A75D]" />
                  <div>
                    <p className="text-[12px] font-bold text-[#0F0F0F]">How was your experience?</p>
                    <p className="text-[11px] text-[#666666]">Share feedback to help others choose</p>
                  </div>
                </div>
                <button
                  onClick={() => { setReviewModal(true); setReviewError(''); }}
                  className="px-4 py-2 rounded-xl bg-[#C9A75D] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#B8964D] transition-colors shrink-0"
                >
                  Write Review
                </button>
              </div>
            )}
            {(hasReview || reviewSuccess) && booking.status === 'completed' && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#16A34A]/5 border border-[#16A34A]/20">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-[#0F0F0F]">Review Submitted</p>
                  <p className="text-[11px] text-[#666666]">Thank you for your feedback!</p>
                </div>
                <Link to="/reviews" className="text-[11px] font-bold text-[#16A34A] hover:underline">View →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[#C9A75D]" />
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#666666]">Payment Summary</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#666666]">Daily Rate</span>
                <span className="font-bold text-[#0F0F0F]">
                  ${booking.vehicle?.pricePerDay?.toLocaleString('en-US') || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#666666]">Duration</span>
                <span className="font-bold text-[#0F0F0F]">{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-px w-full bg-[#ECECEC] my-1" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#0F0F0F]">Total</span>
                <span className="text-[18px] font-bold text-[#0F0F0F]">${booking.totalAmount?.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          {booking.vendor && (
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-[#C9A75D]" />
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#666666]">Vendor</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center overflow-hidden shrink-0">
                  {booking.vendor.avatar?.url ? (
                    <img src={booking.vendor.avatar.url} alt={booking.vendor.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-[#CCCCCC]" />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0F0F0F]">{booking.vendor.name}</p>
                  {booking.vendor.email && (
                    <p className="text-[11px] text-[#999999] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />{booking.vendor.email}
                    </p>
                  )}
                  {booking.vendor.phone && (
                    <p className="text-[11px] text-[#999999] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />{booking.vendor.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#666666] mb-3">Quick Actions</h3>
            <Link
              to="/bookings"
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#F9F9F9] hover:bg-[#F0F0F0] text-[13px] font-bold text-[#0F0F0F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Bookings
            </Link>
            {canDownload && (
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#F9F9F9] hover:bg-[#FFFBF0] text-[13px] font-bold text-[#C9A75D] transition-colors"
              >
                <Download className="w-4 h-4" /> Download Receipt
              </button>
            )}
            {canReview && (
              <button
                onClick={() => { setReviewModal(true); setReviewError(''); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#C9A75D]/10 hover:bg-[#C9A75D]/20 text-[13px] font-bold text-[#C9A75D] transition-colors"
              >
                <Star className="w-4 h-4" /> Leave a Review
              </button>
            )}
            {(hasReview || reviewSuccess) && booking.status === 'completed' && (
              <Link
                to="/reviews"
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#16A34A]/10 hover:bg-[#16A34A]/20 text-[13px] font-bold text-[#16A34A] transition-colors"
              >
                <Check className="w-4 h-4" /> View My Review
              </Link>
            )}
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[13px] font-bold text-[#DC2626] transition-colors"
              >
                <X className="w-4 h-4" /> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Success Banner */}
      <AnimatePresence>
        {reviewSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/20"
          >
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#16A34A]">Review Submitted</p>
              <p className="text-[12px] text-[#666666] mt-0.5">Thank you! Your review has been published.</p>
            </div>
            <Link to="/reviews" className="text-[11px] font-bold text-[#16A34A] hover:underline">View Reviews →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-[#ECECEC] relative"
            >
              <button
                onClick={() => setReviewModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#C9A75D]/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-[#C9A75D]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0F0F0F] mb-1">Leave a Review</h3>
              <p className="text-[13px] text-[#666666] mb-6">{booking?.vehicle?.name}</p>

              {/* Star rating picker */}
              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-2">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= reviewRating ? 'text-[#C9A75D] fill-[#C9A75D]' : 'text-[#ECECEC] fill-[#ECECEC]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-2">
                  Your Review <span className="text-[#999999] normal-case font-normal">({reviewComment.length}/1000)</span>
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => { setReviewComment(e.target.value.slice(0, 1000)); setReviewError(''); }}
                  rows={4}
                  placeholder="Share your experience with this vehicle..."
                  className="w-full bg-[#F9F9F9] border border-[#ECECEC] rounded-xl px-4 py-3 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors resize-none"
                />
                {reviewError && <p className="mt-1.5 text-[12px] text-[#DC2626] font-medium">{reviewError}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setReviewModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewSaving}
                  className="flex-1 py-3 rounded-xl bg-[#0F0F0F] text-white font-bold text-[13px] hover:bg-[#C9A75D] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {reviewSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><Check className="w-4 h-4" /> SUBMIT REVIEW</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-[#ECECEC] rounded-2xl w-full max-w-md p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setCancelModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F3F4F6] text-[#08152E] hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5 mx-auto">
                <X className="w-7 h-7 text-[#DC2626]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F0F0F] text-center mb-2">Cancel Reservation?</h3>
              <p className="text-[13px] text-[#666666] text-center mb-8 leading-relaxed">
                Are you sure you want to cancel this reservation? Depending on the policy, cancellation fees may apply. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  KEEP BOOKING
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-bold text-[13px] hover:shadow-lg hover:shadow-[#DC2626]/30 transition-all disabled:opacity-60"
                >
                  {cancelling ? 'Cancelling...' : 'YES, CANCEL'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
