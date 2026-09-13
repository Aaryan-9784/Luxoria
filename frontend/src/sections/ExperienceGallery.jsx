import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'Exotic Supercars',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 2,
    category: 'Luxury Sedans',
    image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 3,
    category: 'VIP Events',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 4,
    category: 'Premium SUVs',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 5,
    category: 'Chauffeur Services',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 6,
    category: 'Luxury Deliveries',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2070&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  }
];

export default function ExperienceGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-[140px] bg-surface">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Visual Journey</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Premium <span className="text-secondary italic font-light lowercase">Gallery</span>
          </motion.h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
          {GALLERY_IMAGES.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${item.span} h-[250px] md:h-auto`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedImage(item.image)}
            >
              <LuxuryImage
                src={item.image}
                alt={item.category}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white mb-3" />
                <span className="text-white font-bold uppercase tracking-widest text-sm">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
