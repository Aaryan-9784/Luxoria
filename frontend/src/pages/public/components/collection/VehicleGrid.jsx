import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Gauge, DollarSign, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

function VehicleCard({ vehicle }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="group relative bg-background rounded-[30px] border border-border overflow-hidden transition-all duration-500 hover:shadow-float hover:border-accent/40"
    >
      {/* Image Container with Hover Zoom and Glass Overlay */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Luxury Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border",
            vehicle.availability === 'Available' 
              ? "bg-black/40 text-white border-white/20" 
              : "bg-accent/20 text-accent border-accent/20"
          )}>
            {vehicle.availability}
          </div>
        </div>

        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 text-primary shadow-sm backdrop-blur-md">
            {vehicle.category}
          </div>
        </div>
        
        {/* Hover Action Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button className="btn btn-accent rounded-full px-6 py-2 shadow-glow-gold flex items-center gap-2">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
            {vehicle.name}
          </h3>
          <span className="text-sm font-semibold text-secondary flex items-center gap-1">
            {vehicle.startingPrice} <span className="text-xs font-normal text-muted">/day</span>
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Zap className="w-3.5 h-3.5 text-accent" /> Power
            </span>
            <span className="text-sm font-medium text-primary">{vehicle.horsepower}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Gauge className="w-3.5 h-3.5 text-accent" /> Top Speed
            </span>
            <span className="text-sm font-medium text-primary">{vehicle.topSpeed}</span>
          </div>
        </div>
      </div>
      
      {/* Subtle Gold Border Glow Effect on Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/20 rounded-[30px] pointer-events-none transition-colors duration-500" />
    </motion.div>
  );
}

export default function VehicleGrid({ vehicles }) {
  if (vehicles.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">No vehicles found</h3>
        <p className="text-secondary">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-24">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
      >
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </motion.div>
    </div>
  );
}
