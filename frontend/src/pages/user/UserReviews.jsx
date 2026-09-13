import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyReviews, createReview, updateReview, deleteReview } from '@/redux/slices/reviewSlice';
import { fetchMyBookings } from '@/redux/slices/dashboardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MessageSquare, Filter, Trash2, Edit3,
  CalendarDays, X, AlertTriangle, Check, Car, RefreshCw,
  PenLine, ChevronDown, ChevronUp
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { Link } from 'react-router-dom';

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

// Inline write-review form embedded in a booking card
function WriteReviewInline({ booking, onSubmitted }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) { setError('Please write a comment.'); return; }
    setSaving(true);
    setError('');
    const result = await dispatch(
      createReview({
        vehicleId: booking.vehicle._id,
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      })
    );
    setSaving(false);
    if (createReview.fulfilled.match(result)) {
      onSubmitted(booking._id);
      dispatch(fetchMyReviews());
    } else {
      setError(result.payload || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#ECECEC] space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-2">Your Rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-2">
          Your Review <span className="text-[#999999] normal-case font-normal">({comment.length}/1000)</span>
        </p>
        <textarea
          value={comment}
          onChange={(e) => { setComment(e.target.value.slice(0, 1000)); setError(''); }}
          rows={3}
          placeholder="Share your experience with this vehicle..."
          className="w-full bg-[#F9F9F9] border border-[#ECECEC] rounded-xl px-4 py-3 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors resize-none"
        />
        {error && <p className="mt-1 text-[12px] text-[#DC2626] font-medium">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F0F0F] text-white text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-all disabled:opacity-60"
        >
          {saving ? (
            <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
          ) : (
            <><Check className="w-3.5 h-3.5" /> Submit Review</>
          )}
        </button>
      </div>
    </div>
  );
}

// Card for a completed booking that hasn't been reviewed yet
function PendingReviewCard({ booking, onSubmitted }) {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = booking.vehicle?.images?.[0]?.url || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-[#ECECEC] rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={booking.vehicle?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-6 h-6 text-[#CCCCCC]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] font-bold text-[#0F0F0F] truncate">{booking.vehicle?.name || 'Unknown Vehicle'}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
              booking.status === 'completed' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
              booking.status === 'active'    ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                                               'bg-[#C9A75D]/10 text-[#C9A75D]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                booking.status === 'completed' ? 'bg-[#16A34A]' :
                booking.status === 'active'    ? 'bg-[#3B82F6]' :
                                                 'bg-[#C9A75D] animate-pulse'
              }`} />
              {booking.status}
            </span>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 flex items-center gap-1">
            <CalendarDays className="w-3 h-3 shrink-0" />
            {new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' — '}
            {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 ${
            expanded
              ? 'bg-[#F3F4F6] text-[#666666]'
              : 'bg-[#0F0F0F] text-white hover:bg-[#C9A75D]'
          }`}
        >
          <PenLine className="w-3.5 h-3.5" />
          {expanded ? 'Cancel' : 'Send Feedback'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <WriteReviewInline booking={booking} onSubmitted={(id) => { setExpanded(false); onSubmitted(id); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UserReviews() {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector(state => state.reviews);
  const { bookings } = useSelector(state => state.dashboard);
  const { accessToken, loading: authLoading } = useSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [submittedIds, setSubmittedIds] = useState(new Set());

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    if (authLoading || !accessToken) return;
    dispatch(fetchMyReviews());
    dispatch(fetchMyBookings());
  }, [dispatch, accessToken, authLoading]);

  // Completed bookings that don't yet have a review
  const reviewedBookingIds = useMemo(() => {
    const ids = new Set();
    reviews.forEach(r => {
      if (r.booking) ids.add(typeof r.booking === 'string' ? r.booking : r.booking._id);
    });
    return ids;
  }, [reviews]);

  const pendingReviewBookings = useMemo(() => {
    const arr = Array.isArray(bookings) ? bookings : [];
    return arr.filter(b =>
      ['confirmed', 'active', 'completed'].includes(b.status) &&
      !reviewedBookingIds.has(b._id) &&
      !submittedIds.has(b._id)
    );
  }, [bookings, reviewedBookingIds, submittedIds]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        r.vehicle?.name?.toLowerCase().includes(term) ||
        r.vehicle?.brand?.toLowerCase().includes(term) ||
        r.comment?.toLowerCase().includes(term);
      const matchRating = filterRating === 'all' ? true : r.rating === parseInt(filterRating);
      return matchSearch && matchRating;
    });
  }, [reviews, searchTerm, filterRating]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const openEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
    setEditError('');
    setEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editComment.trim()) { setEditError('Please write a comment.'); return; }
    setEditSaving(true);
    setEditError('');
    const result = await dispatch(updateReview({ id: editingReview._id, rating: editRating, comment: editComment.trim() }));
    setEditSaving(false);
    if (updateReview.fulfilled.match(result)) {
      setEditModal(false);
      setEditingReview(null);
    } else {
      setEditError(result.payload || 'Failed to save changes.');
    }
  };

  const openDelete = (id) => { setDeletingId(id); setDeleteModal(true); };

  const handleDelete = async () => {
    setDeleteInProgress(true);
    await dispatch(deleteReview(deletingId));
    setDeleteInProgress(false);
    setDeleteModal(false);
    setDeletingId(null);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-40 bg-[#F0F0F0] rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-60 bg-[#F0F0F0] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-52 rounded-2xl bg-[#F5F5F5] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5">
          <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
        </div>
        <h2 className="text-[18px] font-bold text-[#0F0F0F] mb-2">Failed to Load Reviews</h2>
        <p className="text-[13px] text-[#666666] mb-6 max-w-sm">{error}</p>
        <button
          onClick={() => dispatch(fetchMyReviews())}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F0F0F] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            My Reviews
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage your feedback and experiences.</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors shadow-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#DC2626]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="w-full sm:w-44">
              <CustomSelect
                value={filterRating}
                onChange={setFilterRating}
                icon={Filter}
                options={[
                  { value: 'all', label: 'All Ratings' },
                  { value: '5', label: '5 Stars' },
                  { value: '4', label: '4 Stars' },
                  { value: '3', label: '3 Stars' },
                  { value: '2', label: '2 Stars' },
                  { value: '1', label: '1 Star' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-[#C9A75D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Total Reviews</p>
              <p className="text-[16px] font-bold text-[#0F0F0F]">{reviews.length}</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Average Rating</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[16px] font-bold text-[#0F0F0F]">{avgRating}</span>
              <Star className="w-4 h-4 text-[#C9A75D] fill-[#C9A75D]" />
            </div>
          </div>
          {pendingReviewBookings.length > 0 && (
            <>
              <div className="hidden sm:block h-10 w-px bg-[#ECECEC]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Pending Feedback</p>
                <p className="text-[16px] font-bold text-[#C9A75D]">{pendingReviewBookings.length}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Pending Reviews Section */}
      {pendingReviewBookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-[#C9A75D]" />
              <h2 className="text-[14px] font-bold text-[#0F0F0F] uppercase tracking-wider">Send Feedback</h2>
            </div>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C9A75D] text-white text-[10px] font-bold">
              {pendingReviewBookings.length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingReviewBookings.map(booking => (
                <PendingReviewCard
                  key={booking._id}
                  booking={booking}
                  onSubmitted={(id) => setSubmittedIds(prev => new Set([...prev, id]))}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state — no reviews and no pending */}
      {reviews.length === 0 && pendingReviewBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-[#ECECEC] rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <MessageSquare className="w-9 h-9 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F0F0F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>No Reviews Yet</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            You haven't left any reviews. Share your experience after your next luxury rental.
          </p>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-all"
          >
            <Car className="w-4 h-4" /> View Bookings
          </Link>
        </div>

      ) : reviews.length > 0 ? (
        <>
          {/* Section header when both pending + submitted reviews exist */}
          {pendingReviewBookings.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A75D] fill-[#C9A75D]" />
              <h2 className="text-[14px] font-bold text-[#0F0F0F] uppercase tracking-wider">Your Reviews</h2>
              <span className="text-[12px] text-[#999999] font-medium">({filteredReviews.length})</span>
            </div>
          )}

          {filteredReviews.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
              <Search className="w-10 h-10 text-[#ECECEC] mb-4" />
              <p className="text-[13px] font-medium text-[#666666]">No reviews match your criteria.</p>
              <button onClick={() => { setSearchTerm(''); setFilterRating('all'); }} className="mt-3 text-[12px] font-bold text-[#C9A75D] hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review) => {
                  const imageUrl = review.vehicle?.images?.[0]?.url || review.vehicle?.images?.[0] || null;
                  return (
                    <motion.div
                      key={review._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {/* Card header */}
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
                            {imageUrl ? (
                              <img src={imageUrl} alt={review.vehicle?.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-[#CCCCCC]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-[14px] font-bold text-[#0F0F0F] mb-1.5">
                              {review.vehicle?.name || 'Unknown Vehicle'}
                            </h3>
                            <StarRating value={review.rating} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(review)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors"
                            title="Edit review"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(review._id)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#DC2626] hover:bg-[#F5F5F5] transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5 italic">
                        "{review.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#ECECEC]">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[9px] font-bold uppercase tracking-wider text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Published
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : null}

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-[#ECECEC] relative"
            >
              <button
                onClick={() => setEditModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>

              <h3 className="text-[18px] font-bold text-[#0F0F0F] mb-1">Edit Review</h3>
              <p className="text-[13px] text-[#666666] mb-6">{editingReview.vehicle?.name}</p>

              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-2">Your Rating</label>
                <StarRating value={editRating} onChange={setEditRating} size="lg" />
              </div>

              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-2">
                  Your Review <span className="text-[#999999] normal-case font-normal">({editComment.length}/1000)</span>
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => { setEditComment(e.target.value.slice(0, 1000)); setEditError(''); }}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full bg-[#F9F9F9] border border-[#ECECEC] rounded-xl px-4 py-3 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors resize-none"
                />
                {editError && <p className="mt-1.5 text-[12px] text-[#DC2626] font-medium">{editError}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="flex-1 py-3 rounded-xl bg-[#0F0F0F] text-white font-bold text-[13px] hover:bg-[#C9A75D] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {editSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4" /> SAVE CHANGES</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl border border-[#ECECEC]"
            >
              <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5 mx-auto">
                <AlertTriangle className="w-7 h-7 text-[#DC2626]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0F0F0F] text-center mb-2">Delete Review?</h3>
              <p className="text-[13px] text-[#666666] text-center mb-7 leading-relaxed">
                This review will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  KEEP IT
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteInProgress}
                  className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-bold text-[13px] hover:shadow-lg hover:shadow-[#DC2626]/30 transition-all disabled:opacity-60"
                >
                  {deleteInProgress ? 'Deleting...' : 'DELETE'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
