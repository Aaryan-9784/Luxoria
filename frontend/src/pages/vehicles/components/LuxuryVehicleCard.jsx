import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, GitCompareArrows, ArrowRight, Star, MapPin, Zap, Gauge, Share2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Premium Luxury Vehicle Card — Redesigned for the vehicles page grid.
 * Features image zoom, floating actions, specs bar, and multiple CTAs.
 */
export default function LuxuryVehicleCard({
  vehicle,
  isWishlisted = false,
  onWishlist,
  onQuickView,
  onCompare,
  onShare,
  className,
}) {
  const {
    id, name, brand, image, pricePerDay, category, rating,
    seats, transmission, fuelType, topSpeed, horsepower,
    location, isAvailable, badge,
  } = vehicle;

  const displayRating = typeof rating === 'object' ? rating.average : rating;
  const reviewCount = typeof rating === 'object' ? rating.count : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-background border border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img
          src={image || 'https://images.unsplash.com/photo-1503376760367-11ea234057a6?auto=format&fit=crop&q=80&w=800'}
          alt={`${brand} ${name}`}
          className="w-full h-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          {badge && (
            <span className="px-3 py-1 bg-accent text-white text-[9px] font-bold uppercase tracking-[0.15em] rounded-full shadow-md">
              {badge}
            </span>
          )}
          {category && (
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.12em] rounded-full border border-white/10 capitalize">
              {category}
            </span>
          )}
        </div>

        {/* Floating Actions (reveal on hover) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          {onWishlist && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlist(id); }}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10 shadow-md',
                isWishlisted ? 'bg-accent text-white' : 'bg-black/40 backdrop-blur-md text-white/80 hover:text-white'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', isWishlisted && 'fill-current')} />
            </button>
          )}
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(vehicle); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          {onCompare && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompare(vehicle); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-md"
            >
              <GitCompareArrows className="w-3.5 h-3.5" />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(vehicle); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-white/70 font-medium">
              {horsepower && (
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-accent" />
                  {horsepower}
                </span>
              )}
              {topSpeed && (
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  {topSpeed}
                </span>
              )}
            </div>
            {isAvailable !== undefined && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                isAvailable ? 'bg-success/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
                {isAvailable ? 'Available' : 'Booked'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">
            {brand}
          </span>
          {displayRating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-xs font-bold text-primary">{displayRating}</span>
              {reviewCount && <span className="text-[10px] text-muted">({reviewCount})</span>}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-primary mb-2 tracking-tight leading-tight">
          {name}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-3 text-[11px] text-muted mb-4">
          {seats && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {seats} seats
            </span>
          )}
          {transmission && (
            <span className="capitalize">{transmission}</span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/50 mb-4 mt-auto" />

        {/* Price & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[9px] text-muted uppercase tracking-wider block mb-0.5">From</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-primary">₹{pricePerDay?.toLocaleString()}</span>
              <span className="text-xs text-muted">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/vehicles/${id}`}
              className="text-xs font-semibold text-secondary hover:text-primary transition-colors underline underline-offset-2"
            >
              Details
            </Link>
            <Link
              to={`/vehicles/${id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-accent transition-all duration-400 shadow-sm hover:shadow-md"
            >
              Book
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
