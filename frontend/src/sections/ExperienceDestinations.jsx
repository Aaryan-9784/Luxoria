import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const DESTINATIONS = [
  {
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    subtitle: 'The Oasis of Luxury'
  },
  {
    name: 'Monaco',
    image: 'https://images.unsplash.com/photo-1536682705151-5121b66f2122?q=80&w=2070&auto=format&fit=crop',
    subtitle: 'The Billionaires Playground'
  },
  {
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e9076113881?q=80&w=2072&auto=format&fit=crop',
    subtitle: 'The City of Elegance'
  },
  {
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop',
    subtitle: 'Unmatched Mountain Drives'
  },
  {
    name: 'Italian Coast',
    image: 'https://images.unsplash.com/photo-1516483638261-f40af5ba3b2a?q=80&w=2069&auto=format&fit=crop',
    subtitle: 'Riviera Excursions'
  },
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2065&auto=format&fit=crop',
    subtitle: 'The Metropolis of Dreams'
  }
];

export default function ExperienceDestinations() {
  return (
    <section className="py-[140px] bg-background">
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
            <span className="text-overline tracking-[0.2em] text-primary">Global Presence</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Luxury <span className="text-secondary italic font-light lowercase">Destinations</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((destination, index) => (
            <motion.div
              key={destination.name}
              className="group relative h-[400px] rounded-[24px] overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image */}
              <LuxuryImage
                src={destination.image}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{destination.subtitle}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 drop-shadow-md">{destination.name}</h3>
                  
                  {/* Button */}
                  <div className="flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-xs uppercase tracking-widest font-bold">Explore Experience</span>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
