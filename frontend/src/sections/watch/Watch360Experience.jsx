import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { fadeUp } from '@/lib/motion';

export default function Watch360Experience() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  
  // Drag to rotate simulation
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 1));
  const handleReset = () => {
    setScale(1);
    x.set(0);
  };

  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">Interactive Showcase</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            360° Exploration
          </h2>
          <p className="mt-4 text-gray-600 font-light text-lg">
            Drag to explore the vehicle from every angle. Use controls to zoom in on the meticulous details.
          </p>
        </motion.div>

        {/* 360 Viewer Container */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          ref={containerRef}
        >
          {/* Drag Area */}
          <motion.div 
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-10"
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0.1}
            style={{ x }}
          >
            <motion.div
              style={{ rotateY, scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-[80%] h-[80%] relative perspective-1000"
            >
              {/* Note: In a real 360 viewer, this would be an array of images controlled by drag position.
                  Here we use a high-quality side profile and apply a 3D rotation transform based on drag. */}
              <img 
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200" 
                alt="Vehicle 360 View" 
                className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none"
                draggable="false"
              />
            </motion.div>
          </motion.div>

          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-200">
            <button onClick={handleZoomOut} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-4 bg-gray-300" />
            <button onClick={handleReset} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-4 bg-gray-300" />
            <button onClick={handleZoomIn} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          {/* Instruction Tooltip */}
          <div className="absolute top-6 left-6 z-20 hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-gray-600 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Interactive View
          </div>
        </motion.div>
      </div>
    </section>
  );
}
