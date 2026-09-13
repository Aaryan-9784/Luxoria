import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, Zap, Mountain, Crown, Wind } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicStats } from '@/redux/slices/vehicleSlice';
import { staggerContainer, staggerItem } from '@/lib/motion';

const CATEGORY_DEFINITIONS = [
  { name: 'Sports Cars', icon: Car, slug: 'sports' },
  { name: 'Ultra Luxury', icon: Crown, slug: 'luxury' },
  { name: 'Luxury SUVs', icon: Mountain, slug: 'suv' },
  { name: 'Electric Class', icon: Zap, slug: 'electric' },
  { name: 'Sedans', icon: Crown, slug: 'sedan' },
  { name: 'Convertibles', icon: Wind, slug: 'convertible' },
];

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const { publicStats } = useSelector((state) => state.vehicle);

  useEffect(() => {
    if (!publicStats) {
      dispatch(fetchPublicStats());
    }
  }, [dispatch, publicStats]);

  const categoryCounts = publicStats?.categoryCounts || { sports: 5, luxury: 1 };
  return (
    <section className="section-spacing bg-background">
      <div className="container-luxe">
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
            <span className="text-overline tracking-[0.2em] text-primary">Categories</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Your <span className="text-secondary italic font-light lowercase">Perfect Match</span>
          </motion.h2>
          <motion.p 
            className="text-secondary text-lg leading-relaxed max-w-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From exhilarating sports cars to ultra-comfortable luxury SUVs — explore vehicles tailored to every desire.
          </motion.p>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {CATEGORY_DEFINITIONS.map((cat) => {
            const count = categoryCounts[cat.slug] || 0;
            return (
              <motion.div key={cat.slug} variants={staggerItem}>
                <Link
                  to={`/vehicles?category=${cat.slug}`}
                  className="group relative flex flex-col items-center justify-end p-6 h-64 md:h-80 rounded-3xl border border-white/10 bg-primary overflow-hidden shadow-sm hover:shadow-glow-gold hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative z-10 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="w-12 h-12 rounded-full glass-dark flex items-center justify-center mb-4 group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-500 border border-white/20">
                      <cat.icon className="w-5 h-5 text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-body font-bold text-white mb-1 tracking-wide">{cat.name}</h3>
                    <span className="text-caption text-white/70 uppercase tracking-widest">
                      {count > 0 ? `${count} vehicle${count === 1 ? '' : 's'}` : 'Explore Fleet'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
