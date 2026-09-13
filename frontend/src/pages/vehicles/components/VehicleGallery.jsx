import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { EASE_LUXE } from '@/lib/motion';

export default function VehicleGallery({ images = [] }) {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // lightbox
  const [heroIndex, setHeroIndex]       = useState(0); // hero panel

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[55vh] bg-[#F5F5F5] rounded-3xl flex flex-col items-center justify-center gap-3 border border-[#ECECEC]">
        <Images className="w-10 h-10 text-[#D0D0D0]" />
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#CCCCCC]">No images available</p>
      </div>
    );
  }

  const secondaryImages = images.slice(1, 3);
  const remainingCount  = images.length - 3;

  // Open lightbox at a given index and sync hero
  const openGallery = (idx) => {
    setCurrentIndex(idx);
    setHeroIndex(idx);
    setIsModalOpen(true);
  };

  // Hero inline prev / next
  const heroPrev = (e) => {
    e.stopPropagation();
    setHeroIndex((i) => (i - 1 + images.length) % images.length);
  };
  const heroNext = (e) => {
    e.stopPropagation();
    setHeroIndex((i) => (i + 1) % images.length);
  };

  // Lightbox prev / next
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((i) => (i + 1) % images.length);

  // Keyboard nav inside lightbox
  const handleKey = (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     setIsModalOpen(false);
  };

  return (
    <>
      {/* ── Gallery grid ─────────────────────────────────────────────────────── */}
      <div className="w-full flex gap-3 h-[52vh] md:h-[60vh] lg:h-[68vh]">

        {/* ── Hero image panel ── */}
        <div
          className={`relative overflow-hidden rounded-3xl cursor-pointer group flex-shrink-0
            ${secondaryImages.length > 0 ? 'w-[63%]' : 'w-full'}`}
          onClick={() => openGallery(heroIndex)}
        >
          {/* Animated image swap */}
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_LUXE }}
              src={images[heroIndex]?.url}
              alt="Vehicle main"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/20 group-hover:opacity-0 transition-opacity duration-500 rounded-3xl pointer-events-none" />

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={heroPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={heroNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Expand icon — top right */}
          <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Dot indicators — bottom center */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setHeroIndex(idx); }}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    idx === heroIndex
                      ? 'w-5 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Counter pill — bottom left */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <Images className="w-3.5 h-3.5 text-white/80" />
                <span className="text-[11px] font-bold text-white tracking-wider">
                  {heroIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Secondary stack (lg+) ── */}
        {secondaryImages.length > 0 && (
          <div className="hidden lg:flex flex-col gap-3 flex-1 min-w-0">
            {secondaryImages.map((img, idx) => {
              const isLast      = idx === secondaryImages.length - 1;
              const showOverlay = isLast && remainingCount > 0;
              return (
                <div
                  key={img._id || idx}
                  className="relative overflow-hidden rounded-3xl cursor-pointer group flex-1"
                  onClick={() => openGallery(idx + 1)}
                >
                  <img
                    src={img.url}
                    alt={`Vehicle view ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  {/* hover tint */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/25 group-hover:opacity-0 transition-opacity duration-500 rounded-3xl" />

                  {/* expand icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* +N remaining overlay */}
                  {showOverlay && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center"
                      style={{ background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(2px)' }}
                    >
                      <div className="text-center">
                        <p className="text-[28px] font-bold text-white leading-none">+{remainingCount}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mt-1">More Photos</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Mobile thumbnail strip (below hero, hidden on lg+) ── */}
      {images.length > 1 && (
        <div className="flex lg:hidden gap-2.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={img._id || idx}
              onClick={() => setHeroIndex(idx)}
              className={`shrink-0 w-20 h-14 rounded-2xl overflow-hidden border-2 transition-all
                ${heroIndex === idx
                  ? 'border-[#C9A75D] scale-105'
                  : 'border-transparent hover:border-[#C9A75D]/60'}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Fullscreen lightbox ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/96 backdrop-blur-2xl flex flex-col outline-none"
            tabIndex={-1}
            onKeyDown={handleKey}
            ref={(el) => el?.focus()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A75D]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main image area */}
            <div className="flex-1 flex items-center justify-center px-4 lg:px-16 py-6 relative overflow-hidden">
              {images.length > 1 && (
                <button
                  onClick={prev}
                  className="absolute left-4 lg:left-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.97, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97, x: -20 }}
                  transition={{ duration: 0.35, ease: EASE_LUXE }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={images[currentIndex]?.url}
                    alt={`Gallery ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    style={{ maxHeight: 'calc(100vh - 220px)' }}
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <button
                  onClick={next}
                  className="absolute right-4 lg:right-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="h-28 px-6 pb-5 flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar border-t border-white/8">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-[88px] h-[60px] rounded-xl overflow-hidden transition-all duration-300
                    ${currentIndex === idx
                      ? 'ring-2 ring-[#C9A75D] ring-offset-2 ring-offset-black scale-105 opacity-100'
                      : 'opacity-40 hover:opacity-75 hover:scale-[1.03]'
                    }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
