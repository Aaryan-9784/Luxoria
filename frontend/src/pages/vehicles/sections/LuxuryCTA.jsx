import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { EASE_LUXE, revealOnScroll } from '@/lib/motion';

export default function LuxuryCTA() {
  const scrollToCollection = () => {
    const el = document.getElementById('vehicle-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section {...revealOnScroll} className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://static0.topspeedimages.com/wordpress/wp-content/uploads/2023/01/rolls-royce-wraith.jpg?w=1600&h=900&fit=crop"
          alt="Luxury CTA Background"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
      </div>

      <div className="container-luxe relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="max-w-4xl mx-auto"
        >

          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-tight tracking-tight mb-6 uppercase">
            RESERVE YOUR DREAM <span className="lowercase italic font-light text-gradient-gold pr-2">vehicle</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto mb-12">
            Experience the pinnacle of automotive engineering and unmatched luxury service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={scrollToCollection}
              className="group relative px-8 py-4 bg-accent text-white font-medium text-xs md:text-sm tracking-[0.15em] uppercase overflow-hidden rounded-sm transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(201,167,93,0.4)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Browse Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            <Link
              to="/contact"
              className="group px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-xs md:text-sm tracking-[0.15em] uppercase rounded-sm hover:border-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
              Contact Concierge
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
