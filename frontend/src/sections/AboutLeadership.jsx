import React from 'react';
import { motion } from 'framer-motion';
import LuxuryImage from '@/components/ui/LuxuryImage';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TEAM = [
  {
    name: 'Aryan Patel',
    role: 'Founder & CEO',
    image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  },
  {
    name: 'Kevin Patel',
    role: 'Co-founder',
    image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  },
  {
    name: 'Jay Patel',
    role: 'Luxury Experience Manager',
    image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  },
  {
    name: 'Krish Patel',
    role: 'Operational Director',
    image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  }
];

export default function AboutLeadership() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">The Visionaries</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Leadership & <span className="text-secondary italic font-light lowercase">Expertise</span>
          </motion.h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] mb-6 bg-surface">
                <LuxuryImage
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100"
                />
                
                {/* Hover Socials */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-white text-white/90 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-white text-white/90 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-white text-white/90 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-primary tracking-wide mb-1">{member.name}</h3>
                <p className="text-accent uppercase tracking-widest text-xs font-semibold">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
