import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const COLLECTION = [
  {
    id: '1',
    name: 'Rolls Royce Ghost',
    brand: 'Rolls Royce',
    price: '$2,500',
    specs: '563 HP • 250 km/h • 4.8 sec',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Bugatti Chiron',
    brand: 'Bugatti',
    price: '$15,000',
    specs: '1500 HP • 420 km/h • 2.4 sec',
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Porsche 911 Turbo S',
    brand: 'Porsche',
    price: '$1,500',
    specs: '640 HP • 330 km/h • 2.6 sec',
    badge: 'Editors Choice',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'McLaren 720S',
    brand: 'McLaren',
    price: '$1,900',
    specs: '710 HP • 341 km/h • 2.8 sec',
    badge: 'Track Focused',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Ferrari 296 GTB',
    brand: 'Ferrari',
    price: '$2,200',
    specs: '819 HP • 330 km/h • 2.9 sec',
    badge: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Lamborghini Huracan EVO',
    brand: 'Lamborghini',
    price: '$2,800',
    specs: '630 HP • 325 km/h • 2.9 sec',
    badge: 'Exotic Pick',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function SignatureCollection() {
  return (
    <section className="py-[140px] bg-background">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">The Collection</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Signature <br /> <span className="text-secondary italic font-light lowercase">fleet</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/vehicles" className="group flex items-center gap-3 text-primary font-medium hover:text-accent transition-colors pb-2 border-b border-primary hover:border-accent uppercase tracking-widest text-sm">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COLLECTION.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              className="group relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-surface shadow-md hover:shadow-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[12px] hover:shadow-[0_40px_80px_rgba(201,167,93,0.15)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image */}
              <LuxuryImage
                src={vehicle.image}
                alt={vehicle.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              />



              {/* Premium Dark Overlays */}
              {/* Base Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 transition-opacity duration-[400ms]" />
              {/* Hover Darken Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10 flex flex-col justify-end transform transition-transform duration-[400ms] ease-out z-10">

                {/* Brand & Name */}
                <p className="text-accent uppercase tracking-widest text-xs font-bold mb-2 drop-shadow-md">{vehicle.brand}</p>
                <h3 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{vehicle.name}</h3>

                {/* Vehicle Specs */}
                <p className="text-white/70 text-xs font-medium tracking-wide uppercase mb-8 border-l-2 border-accent pl-3">
                  {vehicle.specs}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-medium">Starting from</p>
                    <p className="text-xl font-bold text-white drop-shadow-md">{vehicle.price} <span className="text-sm font-normal text-white/50">/day</span></p>
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
