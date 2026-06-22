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
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2560"
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
          <span className="text-accent text-[11px] font-bold tracking-[0.25em] uppercase block mb-4 drop-shadow-md">
            Begin Your Journey
          </span>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight tracking-tight mb-6">
            Reserve Your Dream <br />
            <span className="text-gradient-gold">Vehicle Today</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto mb-12">
            Experience the pinnacle of automotive engineering and unmatched luxury service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCollection}
              className="w-full sm:w-auto btn bg-accent text-white hover:bg-accent-hover btn-xl rounded-full shadow-[0_0_30px_rgba(201,167,93,0.3)] hover:shadow-[0_0_50px_rgba(201,167,93,0.5)] transition-all duration-500 hover:scale-105"
            >
              Browse Collection
            </button>
            <Link
              to="/contact"
              className="w-full sm:w-auto btn bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 btn-xl rounded-full transition-all duration-500 hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Concierge
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
