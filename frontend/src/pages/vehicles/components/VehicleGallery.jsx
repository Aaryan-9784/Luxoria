import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { EASE_LUXE } from '@/lib/motion';

export default function VehicleGallery({ images = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="w-full h-[50vh] bg-surface rounded-3xl" />;
  }

  const primaryImage = images[0]?.url;
  const secondaryImages = images.slice(1, 3);
  const remainingCount = images.length - 3;

  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex gap-4 overflow-hidden rounded-3xl">
        
        {/* Main Hero Image */}
        <div 
          className={`relative h-full overflow-hidden cursor-pointer group ${secondaryImages.length > 0 ? 'w-full lg:w-2/3' : 'w-full'}`}
          onClick={() => openGallery(0)}
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: EASE_LUXE }}
            src={primaryImage}
            alt="Vehicle main"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Secondary Stack (Desktop Only) */}
        {secondaryImages.length > 0 && (
          <div className="hidden lg:flex flex-col gap-4 w-1/3 h-full">
            {secondaryImages.map((img, idx) => (
              <div 
                key={img._id || idx} 
                className="relative h-1/2 overflow-hidden rounded-2xl cursor-pointer group"
                onClick={() => openGallery(idx + 1)}
              >
                <img
                  src={img.url}
                  alt={`Vehicle view ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                
                {/* Show remaining count overlay on the last visible image if there are more */}
                {idx === 1 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-h3 text-white">+{remainingCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: EASE_LUXE }}
                  src={images[currentIndex]?.url}
                  alt="Gallery full"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Navigation */}
            <div className="h-32 px-6 pb-6 flex items-center justify-center gap-4 overflow-x-auto custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                    currentIndex === idx ? 'ring-2 ring-accent scale-105' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
