import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Rolls Royce', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Rolls-Royce_Motor_Cars_logo.svg/1200px-Rolls-Royce_Motor_Cars_logo.svg.png' },
  { name: 'Bentley', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Bentley_logo.svg/1200px-Bentley_logo.svg.png' },
  { name: 'Ferrari', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1200px-Ferrari-Logo.svg.png' },
  { name: 'Lamborghini', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/1200px-Lamborghini_Logo.svg.png' },
  { name: 'Porsche', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Porsche_logo.svg/1200px-Porsche_logo.svg.png' },
  { name: 'Aston Martin', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Aston_Martin_logo.svg/1200px-Aston_Martin_logo.svg.png' },
  { name: 'Mercedes', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1200px-Mercedes-Logo.svg.png' },
  { name: 'McLaren', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/McLaren_logo.svg/1200px-McLaren_logo.svg.png' }
];

export default function BrandShowcase() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">Elite Partners</h2>
          <p className="text-slate-500 mt-4 font-light">Experience engineering perfection from the world's most prestigious marques.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-white/70 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 flex items-center justify-center aspect-square transition-all cursor-pointer group"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="w-16 h-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0 duration-300" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
