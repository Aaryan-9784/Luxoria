import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { fadeUp } from '@/lib/motion';

const categories = ['All', 'Supercars', 'Hypercars', 'Chauffeur Experience', 'Exotic Collection', 'VIP Delivery'];

const videos = [
  { id: 1, title: 'The Ferrari Roma Experience', category: 'Supercars', thumbnail: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200', videoUrl: 'https://videos.pexels.com/video-files/8569830/8569830-hd_1920_1080_30fps.mp4' },
  { id: 2, title: 'Bugatti Chiron Pur Sport', category: 'Hypercars', thumbnail: 'https://images.unsplash.com/photo-1627454819213-9a3b61033ce5?auto=format&fit=crop&q=80&w=1200', videoUrl: 'https://videos.pexels.com/video-files/5309605/5309605-hd_1920_1080_25fps.mp4' },
  { id: 3, title: 'Rolls-Royce Phantom Arrival', category: 'Chauffeur Experience', thumbnail: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1200', videoUrl: 'https://videos.pexels.com/video-files/3752831/3752831-hd_1920_1080_24fps.mp4' },
  { id: 4, title: 'Lamborghini Aventador SVJ', category: 'Exotic Collection', thumbnail: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&q=80&w=1200', videoUrl: 'https://videos.pexels.com/video-files/8569830/8569830-hd_1920_1080_30fps.mp4' },
  { id: 5, title: 'White-Glove Handover', category: 'VIP Delivery', thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200', videoUrl: 'https://videos.pexels.com/video-files/5309605/5309605-hd_1920_1080_25fps.mp4' },
];

export default function WatchVideoGallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">Cinematic Showcase</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            The Luxoria Gallery
          </h2>
        </motion.div>

        {/* Categories */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredVideos.map((video) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={video.id}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 group-hover:text-gray-600 transition-colors">{video.title}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{video.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 text-white/70 hover:text-white z-50 p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-2xl relative"
            >
              <video 
                autoPlay 
                controls 
                className="w-full h-full object-contain"
                src={selectedVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
