import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MessageSquare, Filter, Trash2, Edit3, CalendarDays } from 'lucide-react';

const MOCK_REVIEWS = [
  {
    id: '1',
    vehicle: { name: 'Rolls-Royce Phantom', image: 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?auto=format&fit=crop&q=80&w=600' },
    rating: 5,
    comment: 'Absolutely phenomenal experience. The car was in pristine condition, and the delivery was seamless. Worth every penny for our wedding anniversary.',
    date: '2025-10-15',
    status: 'Published'
  },
  {
    id: '2',
    vehicle: { name: 'Lamborghini Huracán', image: 'https://images.unsplash.com/photo-1663431263243-ef4aaeca0e71?auto=format&fit=crop&q=80&w=600' },
    rating: 4,
    comment: 'Incredible performance and sound. Deducting one star because the pickup location was slightly difficult to find, but the car itself was a dream.',
    date: '2025-09-02',
    status: 'Published'
  },
  {
    id: '3',
    vehicle: { name: 'Bentley Continental GT', image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=600' },
    rating: 5,
    comment: 'The perfect grand tourer for our weekend getaway. Luxoria support was highly responsive and accommodating to our schedule changes.',
    date: '2025-07-20',
    status: 'Published'
  }
];

export default function UserReviews() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' ? true : review.rating === parseInt(filterRating);
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, filterRating]);

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;

  const handleDelete = (id) => {
    // In a real app, this would dispatch an action
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">My Reviews</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Manage your feedback and experiences.</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input 
                type="text" 
                placeholder="Search reviews..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors shadow-sm"
              />
            </div>

            {/* Filter */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full sm:w-auto bg-white border border-[#ECECEC] rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] transition-colors appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Bar */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#C9A75D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Total Reviews</p>
              <p className="text-[16px] font-bold text-[#0F0F0F]">{reviews.length}</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Average Rating</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[16px] font-bold text-[#0F0F0F]">{avgRating}</span>
              <Star className="w-4 h-4 text-[#C9A75D] fill-[#C9A75D]" />
            </div>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#ECECEC] border-dashed rounded-2xl shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-serif text-[#0F0F0F] mb-3">No Reviews Yet</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            You haven't left any reviews. Share your experience after your next luxury rental to help others in the community.
          </p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <Search className="w-10 h-10 text-[#ECECEC] mb-4" />
          <p className="text-[13px] font-medium text-[#666666]">No reviews found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
                      <img src={review.vehicle.image} alt={review.vehicle.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#0F0F0F] mb-1">{review.vehicle.name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#C9A75D] fill-[#C9A75D]' : 'text-[#ECECEC] fill-[#ECECEC]'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="p-1.5 rounded-lg text-[#666666] hover:text-[#DC2626] hover:bg-[#F5F5F5] transition-colors">
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
                    {new Date(review.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[9px] font-bold uppercase tracking-wider text-[#16A34A]">
                    {review.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </motion.div>
  );
}
