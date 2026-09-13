import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const COLLECTIONS = [
  {
    id: '1',
    name: 'Supercar Experience',
    category: 'Adrenaline',
    desc: 'Unleash raw power and performance.',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Luxury Sedan Experience',
    category: 'Elegance',
    desc: 'Unmatched comfort and sophistication.',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Executive Travel',
    category: 'Business',
    desc: 'Chauffeur-driven corporate mobility.',
    badge: 'B2B',
    image: 'https://images.unsplash.com/photo-1549314421-4f36611593c6?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Wedding Collection',
    category: 'Celebration',
    desc: 'Make your special day unforgettable.',
    badge: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Luxury SUV Journey',
    category: 'Adventure',
    desc: 'Commanding presence for any terrain.',
    badge: 'Spacious',
    image: 'https://images.unsplash.com/photo-1606016159991-d5225c93c180?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Weekend Escape',
    category: 'Lifestyle',
    desc: 'Curated getaways in luxury vehicles.',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1503376760301-19ce9254d7e9?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function ExperienceCollections() {
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
              <span className="text-overline tracking-[0.2em] text-primary">Curated Selection</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Experience <br /> <span className="text-secondary italic font-light lowercase">collections</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/collection" className="group flex items-center gap-3 text-primary font-medium hover:text-accent transition-colors pb-2 border-b border-primary hover:border-accent uppercase tracking-widest text-sm">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="group relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-surface shadow-md hover:shadow-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[12px] hover:shadow-[0_40px_80px_rgba(201,167,93,0.15)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image */}
              <LuxuryImage
                src={collection.image}
                alt={collection.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              />



              {/* Premium Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 transition-opacity duration-[400ms]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10 flex flex-col justify-end transform transition-transform duration-[400ms] ease-out z-10">

                <p className="text-accent uppercase tracking-widest text-xs font-bold mb-2 drop-shadow-md">{collection.category}</p>
                <h3 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{collection.name}</h3>

                <p className="text-white/70 text-sm font-medium tracking-wide mb-8 border-l-2 border-accent pl-3">
                  {collection.desc}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-medium">Discover</p>
                    <p className="text-lg font-bold text-white drop-shadow-md cursor-pointer hover:text-accent transition-colors">View Details</p>
                  </div>

                  {/* Hover Button */}
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[400ms] ease-out shadow-[0_10px_20px_rgba(201,167,93,0.3)]">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
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
