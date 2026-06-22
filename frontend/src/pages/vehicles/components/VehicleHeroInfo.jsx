import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2, Shield } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function VehicleHeroInfo({ vehicle }) {
  if (!vehicle) return null;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mb-8 border-b border-border pb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        
        {/* Left Side: Badges & Title */}
        <div className="flex-1">
          <motion.div variants={staggerItem} className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-accent/10 text-accent text-caption font-semibold rounded-full uppercase tracking-wider">
              {vehicle.category}
            </span>
            {vehicle.rating?.average >= 4.8 && (
              <span className="px-3 py-1 bg-gradient-gold text-white text-caption font-semibold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> Top Rated
              </span>
            )}
            <span className="px-3 py-1 bg-surface border border-border text-primary text-caption font-semibold rounded-full uppercase tracking-wider">
              {vehicle.year}
            </span>
          </motion.div>

          <motion.h1 variants={staggerItem} className="text-display text-primary leading-[1.1] mb-2 uppercase">
            {vehicle.brand} <span className="font-light">{vehicle.model || vehicle.name.replace(vehicle.brand, '')}</span>
          </motion.h1>

          <motion.div variants={staggerItem} className="flex items-center gap-4 text-body-sm text-secondary">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="font-semibold text-primary">{vehicle.rating?.average || 0}</span>
              <span>({vehicle.rating?.count || 0} reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{vehicle.location?.city}, {vehicle.location?.state}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Trust Signals */}
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:items-end mt-4 lg:mt-0">
           <div className="flex items-center gap-2 text-body-sm text-success font-medium px-4 py-2 bg-success/5 rounded-xl border border-success/10">
             <CheckCircle2 className="w-5 h-5" />
             <span>Instant Confirmation Available</span>
           </div>
           <div className="flex items-center gap-2 text-body-sm text-primary font-medium px-4 py-2 bg-surface rounded-xl border border-border">
             <Shield className="w-5 h-5 text-accent" />
             <span>Luxoria Premium Insurance Included</span>
           </div>
        </motion.div>
      </div>

      <motion.p variants={staggerItem} className="mt-6 text-body text-secondary leading-relaxed max-w-4xl">
        {vehicle.description}
      </motion.p>
    </motion.div>
  );
}
