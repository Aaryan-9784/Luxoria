import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Settings, Fuel, ArrowRight, Activity, Eye, BarChart2 } from 'lucide-react';
import Badge from './Badge';

/**
 * Premium Vehicle Card — 4:5 Aspect Ratio
 * Features image zoom, floating actions, luxury gradients.
 */
export default function VehicleCard({
  id,
  name,
  brand,
  image,
  pricePerDay,
  category,
  rating,
  seats,
  transmission,
  fuelType,
  topSpeed = '320 km/h',
  horsepower = '600 HP',
  zeroToHundred = '3.0 sec',
  badge = 'Featured',
  isFavorited = false,
  onToggleFavorite,
  className,
}) {
  return (
    <motion.div
      className={cn('card-lift group relative overflow-hidden flex flex-col rounded-[2rem] bg-background border border-border/20 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out', className)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface">
        <img
          src={image || 'https://images.unsplash.com/photo-1503376760367-11ea234057a6?auto=format&fit=crop&q=80&w=800'}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />

        {/* Premium Vignette / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Row — Category Badge (Left) & Premium Badge (Right) */}
        {/* We can hide category badge if not needed, but keeping it top-left as in original or removed. Image doesn't show left badge, only right badge. Let's keep right badge. */}


        {/* Top Right — Floating Actions (Hover Reveal - keep below badge or left) */}
        <div className="absolute top-16 right-5 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out z-30">
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(id); }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10 shadow-lg',
                isFavorited ? 'bg-accent text-white border-accent' : 'bg-black/50 backdrop-blur-md text-white/80 hover:text-white'
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorited && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Bottom Content within Image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col z-20">
          
          <div className="mb-4">
            <span className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase block mb-1 drop-shadow-md">
              {brand}
            </span>
            <h3 className="text-3xl font-bold text-white leading-tight drop-shadow-lg mb-3">
              {name}
            </h3>
            
            {/* Specs Line */}
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-4 bg-accent" />
              <span className="text-xs font-medium text-white/80 tracking-widest uppercase">
                {horsepower} • {topSpeed} • {zeroToHundred}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 my-4" />

          {/* Price & CTA */}
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white tracking-tight">${pricePerDay?.toLocaleString()}</span>
                <span className="text-sm text-white/60">/day</span>
              </div>
            </div>

            <Link
              to={`/vehicles/${id}`}
              className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-white hover:bg-[#c5a030] hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.4)] relative overflow-hidden group/btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              <ArrowRight className="w-6 h-6 -rotate-45 relative z-10" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
