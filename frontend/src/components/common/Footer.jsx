import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import toast from '@/lib/toast';
import api from '@/services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await api.post('/newsletter/subscribe', { email: email.trim() });
        toast.success(`Subscribed successfully with ${email}`);
        setEmail('');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
      }
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle gold glow behind footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Column 1: Brand & Newsletter (Takes 4 cols on lg) */}
          <div className="flex flex-col gap-8 lg:col-span-4 lg:pr-12">
            <Link to="/" className="flex items-center gap-3 group w-fit select-none">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-lg group-hover:border-[#D4AF37]/50 transition-colors">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-[0.2em] uppercase text-white font-serif">
                Luxoria
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-sm">
              Subscribe to our exclusive newsletter to receive updates on new additions to our collection, private events, and member-only experiences.
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors text-white placeholder:text-white/40"
                required
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Collection (2 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <h4 className="text-xs text-white/50 tracking-widest uppercase font-semibold mb-2">Collection</h4>
            {['Hypercars', 'Supercars', 'Luxury Sedans', 'SUVs', 'Electric Luxury', 'Limited Editions'].map((item) => (
              <Link key={item} to={`/collection?category=${encodeURIComponent(item)}`} className="text-sm text-white/80 hover:text-[#D4AF37] transition-colors w-fit">
                {item}
              </Link>
            ))}
          </div>

          {/* Column 3: Experiences (2 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <h4 className="text-xs text-white/50 tracking-widest uppercase font-semibold mb-2">Experiences</h4>
            {['Track Days', 'Coastal Tours', 'Chauffeur Services', 'Wedding Fleet', 'Corporate Events'].map((item) => (
              <Link key={item} to={`/experience?type=${encodeURIComponent(item)}`} className="text-sm text-white/80 hover:text-[#D4AF37] transition-colors w-fit">
                {item}
              </Link>
            ))}
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <h4 className="text-xs text-white/50 tracking-widest uppercase font-semibold mb-2">Company</h4>
            {['About Us', 'Careers', 'Press', 'Investors'].map((item) => (
              <Link key={item} to="/about" className="text-sm text-white/80 hover:text-[#D4AF37] transition-colors w-fit">
                {item}
              </Link>
            ))}
          </div>

          {/* Column 5: Support (2 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <h4 className="text-xs text-white/50 tracking-widest uppercase font-semibold mb-2">Support</h4>
            <div className="flex flex-col gap-4 text-sm text-white/80">
              <Link to="/contact" className="hover:text-[#D4AF37] transition-colors w-fit">Contact Us</Link>
              <Link to="/contact" className="hover:text-[#D4AF37] transition-colors w-fit">FAQ</Link>
              <a href="tel:+918238012515" className="hover:text-[#D4AF37] transition-colors w-fit">+91 82380 12515</a>
              <a href="mailto:aaryanpatel9784@gmail.com" className="hover:text-[#D4AF37] transition-colors w-fit">aaryanpatel9784@gmail.com</a>
            </div>

            <div className="flex items-center gap-4 mt-2">
              {[
                { Icon: Instagram, href: "https://instagram.com/luxoria" },
                { Icon: Twitter, href: "https://twitter.com/luxoria" },
                { Icon: Linkedin, href: "https://linkedin.com/company/luxoria" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/50">
            © {year} LUXORIA. Crafted for excellence. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-xs text-white/50">
             <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
