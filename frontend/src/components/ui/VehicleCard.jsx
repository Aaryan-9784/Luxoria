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
      className={cn('card-lift group relative overflow-hidden flex flex-col rounded-3xl bg-background border border-border/60 hover:shadow-card-hover transition-all duration-500 ease-out', className)}
    >
      {/* 4:5 Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={image || 'https://images.unsplash.com/photo-1503376760367-11ea234057a6?auto=format&fit=crop&q=80&w=800'}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          loading="lazy"
        />

        {/* Premium Vignette / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Top Row — Category Badge & Premium Badge */}
        <div className="absolute top-5 left-5">
          <div className="glass-dark px-3 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-caption text-white font-medium uppercase tracking-wider">{category}</span>
          </div>
        </div>

        {badge && (
          <div className="absolute top-5 right-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
            <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {badge}
            </span>
          </div>
        )}

        {/* Top Right — Floating Actions (Hover Reveal) */}
        <div className="absolute top-5 right-5 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out z-30">
          <button className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10">
            <Eye className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10">
            <BarChart2 className="w-4 h-4" />
          </button>
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(id); }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10',
                isFavorited ? 'bg-accent text-white' : 'glass-dark text-white/80 hover:text-white hover:bg-white/20'
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorited && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Bottom Content within Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          
          <div>
            <span className="text-accent text-overline tracking-widest block mb-1 drop-shadow-md">{brand}</span>
            <h3 className="text-h3 font-bold text-white leading-tight drop-shadow-lg">
              {name}
            </h3>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <div className="flex flex-col items-center justify-center gap-1 py-2 glass-dark rounded-xl border border-white/5">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-medium">Power</span>
              <span className="text-[11px] font-bold text-white tracking-wider">{horsepower}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-2 glass-dark rounded-xl border border-white/5">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-medium">Top Speed</span>
              <span className="text-[11px] font-bold text-white tracking-wider">{topSpeed}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-2 glass-dark rounded-xl border border-white/5">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-medium">0-100 km/h</span>
              <span className="text-[11px] font-bold text-white tracking-wider">{zeroToHundred}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Persistent Bottom Bar (Price & CTA) */}
      <div className="bg-background p-5 flex items-center justify-between border-t border-border/50 relative overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col">
          <span className="text-caption text-muted uppercase tracking-wider mb-0.5">Starting at</span>
          <div className="flex items-baseline gap-1 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all">
            <span className="text-h4 font-bold text-primary group-hover:text-accent transition-colors">₹{pricePerDay?.toLocaleString()}</span>
            <span className="text-body-sm text-secondary">/ day</span>
          </div>
        </div>

        <Link
          to={`/vehicles/${id}`}
          className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-accent group-hover:shadow-glow-gold transition-all duration-300 hover:scale-105"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
        </Link>
      </div>
    </motion.div>
  );
}
