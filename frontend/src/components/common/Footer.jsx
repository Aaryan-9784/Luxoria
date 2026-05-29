import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background text-primary pt-24 pb-12 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          
          {/* Column 1: Brand Story */}
          <div className="flex flex-col gap-6 lg:pr-12">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-[0.15em] uppercase text-primary">
                Luxoria
              </span>
            </Link>
            <p className="text-body-sm leading-relaxed text-secondary max-w-sm">
              Experience the pinnacle of automotive luxury. Our curated collection
              of premium vehicles ensures every journey is an extraordinary statement of prestige and power.
            </p>
          </div>

          {/* Column 2: Collection */}
          <div className="flex flex-col gap-5">
            <h4 className="text-overline text-primary tracking-widest mb-2">Collection</h4>
            {['Rolls Royce', 'Bugatti', 'Porsche', 'McLaren', 'Ferrari', 'Lamborghini'].map((item) => (
              <Link key={item} to={`/vehicles?brand=${item.toLowerCase()}`} className="text-body-sm text-secondary hover:text-accent transition-colors w-fit">
                {item}
              </Link>
            ))}
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-5">
            <h4 className="text-overline text-primary tracking-widest mb-2">Company</h4>
            {['About Us', 'Experience', 'Membership', 'Press', 'Careers'].map((item) => (
              <Link key={item} to="#" className="text-body-sm text-secondary hover:text-accent transition-colors w-fit">
                {item}
              </Link>
            ))}
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="text-overline text-primary tracking-widest mb-2">Contact</h4>
            <div className="flex flex-col gap-4 text-body-sm text-secondary">
              <p className="leading-relaxed">
                123 Luxury Avenue<br />
                Beverly Hills, CA 90210<br />
                United States
              </p>
              <a href="tel:+18001234567" className="hover:text-accent transition-colors w-fit">+1 (800) 123-4567</a>
              <a href="mailto:concierge@luxoria.com" className="hover:text-accent transition-colors w-fit">concierge@luxoria.com</a>
            </div>

            <div className="flex items-center gap-4 mt-2">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-secondary hover:bg-surface hover:text-primary transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-caption text-secondary">
            © {year} LUXORIA. Crafted for excellence.
          </p>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-caption text-secondary">
             <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
             <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
