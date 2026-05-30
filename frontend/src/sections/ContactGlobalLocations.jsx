import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const LOCATIONS = [
  { city: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop' },
  { city: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop' },
  { city: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2065&auto=format&fit=crop' },
  { city: 'Monaco', image: 'https://images.unsplash.com/photo-1577717903273-094770b284e3?q=80&w=2070&auto=format&fit=crop' },
  { city: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e90760020c2?q=80&w=2073&auto=format&fit=crop' },
  { city: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e2815cb?q=80&w=2070&auto=format&fit=crop' }
];

export default function ContactGlobalLocations() {
  return (
    <section className="py-[140px] bg-background relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Worldwide Access</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Global Service <span className="text-secondary italic font-light lowercase">Locations</span>
          </motion.h2>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((location, index) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[2px]"
            >
              <LuxuryImage
                src={location.image}
                alt={`${location.city} Location`}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <MapPin className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-bold text-white tracking-wide">{location.city}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
