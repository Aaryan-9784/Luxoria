import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { clearQuickView, toggleWishlist, addToCompare } from '@/redux/slices/vehicleSlice';
import { Link } from 'react-router-dom';
import {
  X, Star, MapPin, Zap, Gauge, Fuel, Settings, Users, Heart,
  GitCompareArrows, ArrowRight, Check, Calendar, Shield,
} from 'lucide-react';
import { EASE_LUXE, modalOverlay } from '@/lib/motion';

export default function QuickViewModal() {
  const dispatch = useDispatch();
  const vehicle = useSelector(state => state.vehicle.quickViewVehicle);
  const wishlist = useSelector(state => state.vehicle.wishlist);
  const [activeImage, setActiveImage] = useState(0);

  const isOpen = !!vehicle;
  const isWishlisted = vehicle ? wishlist.includes(vehicle.id) : false;

  // Close on Escape
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') dispatch(clearQuickView()); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!vehicle) return null;

  const images = vehicle.images || [vehicle.image];
  const displayRating = typeof vehicle.rating === 'object' ? vehicle.rating.average : vehicle.rating;
  const reviewCount = typeof vehicle.rating === 'object' ? vehicle.rating.count : null;

  const specs = [
    { icon: Zap, label: 'Horsepower', value: vehicle.horsepower || '—' },
    { icon: Gauge, label: 'Top Speed', value: vehicle.topSpeed || '—' },
    { icon: Settings, label: 'Engine', value: vehicle.engine || '—' },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission || '—' },
    { icon: Users, label: 'Seats', value: vehicle.seats || '—' },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType || '—' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            {...modalOverlay}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => dispatch(clearQuickView())}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE_LUXE } }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.25 } }}
            className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close */}
            <button
              onClick={() => dispatch(clearQuickView())}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row overflow-y-auto">
              {/* Image Gallery */}
              <div className="lg:w-[55%] bg-surface relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={images[activeImage]}
                    alt={`${vehicle.brand} ${vehicle.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />


                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          activeImage === i ? 'border-accent shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <span className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase block mb-1">
                    {vehicle.brand}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight mb-3">
                    {vehicle.name}
                  </h2>

                  <div className="flex items-center gap-4">
                    {displayRating && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-bold text-primary">{displayRating}</span>
                        {reviewCount && <span className="text-xs text-muted">({reviewCount} reviews)</span>}
                      </div>
                    )}
                    {vehicle.location && (
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="w-3.5 h-3.5" />
                        {vehicle.location}
                      </span>
                    )}
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      vehicle.isAvailable ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {vehicle.isAvailable ? 'Available Now' : 'Currently Booked'}
                    </div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-3 bg-surface rounded-xl border border-border/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-primary capitalize">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicle.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="flex items-center gap-4 mb-6 p-3 bg-accent/5 rounded-xl border border-accent/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-accent font-semibold">
                    <Shield className="w-3.5 h-3.5" /> Fully Insured
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-accent font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> Free Cancellation
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-muted uppercase tracking-wider block mb-0.5">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">${vehicle.pricePerDay?.toLocaleString()}</span>
                        <span className="text-sm text-muted">/day</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      onClick={() => dispatch(clearQuickView())}
                      className="flex-1 btn btn-primary btn-lg rounded-xl justify-center"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => dispatch(toggleWishlist(vehicle.id))}
                      className={`btn btn-lg rounded-xl ${
                        isWishlisted ? 'btn-accent' : 'btn-outline'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => dispatch(addToCompare(vehicle))}
                      className="btn btn-outline btn-lg rounded-xl"
                    >
                      <GitCompareArrows className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
