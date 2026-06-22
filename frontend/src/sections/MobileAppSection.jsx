import React from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXE } from '@/lib/motion';
import { MapPin, CalendarCheck, Car, Bell, Navigation, CheckCircle2 } from 'lucide-react';

export default function MobileAppSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden border-y border-white/5">
      {/* Background gradients and glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-accent/20 via-transparent to-transparent opacity-30 pointer-events-none rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE_LUXE }}
          >
            <span className="text-overline text-accent mb-6 block tracking-[0.2em] uppercase">The Luxoria App</span>
            <h2 className="text-h1 text-white mb-8 leading-[1.1] font-light">
              <span className="font-bold">Luxury</span> at Your<br />
              <span className="text-gradient-gold italic">Fingertips.</span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-12 max-w-lg font-light">
              Control your entire luxury experience from our award-winning mobile application. Instantly book, unlock, and manage your fleet with a single tap.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-5 mb-12">
              {[
                { icon: Navigation, label: 'Real-Time GPS' },
                { icon: CalendarCheck, label: '1-Tap Booking' },
                { icon: Car, label: 'Digital Key' },
                { icon: Bell, label: '24/7 Concierge Chat' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: EASE_LUXE }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-dark border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-body-sm font-bold text-white tracking-wide">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl hover:bg-white/90 hover:scale-105 transition-all shadow-glow-gold group">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-secondary leading-none font-medium uppercase tracking-widest">Download on the</p>
                  <p className="text-base font-bold text-primary leading-tight">App Store</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* ── 3D Phone Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: EASE_LUXE }}
            className="hidden lg:flex justify-center relative h-[700px] items-center perspective-[1000px]"
          >
            {/* Phone Container with 3D Float */}
            <motion.div 
              animate={{ y: [-15, 15, -15], rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Premium Phone frame */}
              <div className="w-[320px] h-[650px] bg-gradient-to-br from-white/20 via-white/5 to-white/10 rounded-[3.5rem] border-[3px] border-white/20 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-sm relative">
                
                {/* Volume/Power Buttons */}
                <div className="absolute left-[-5px] top-[120px] w-1 h-12 bg-white/30 rounded-l-md shadow-[inset_1px_0_2px_rgba(255,255,255,0.5)]" />
                <div className="absolute left-[-5px] top-[180px] w-1 h-12 bg-white/30 rounded-l-md shadow-[inset_1px_0_2px_rgba(255,255,255,0.5)]" />
                <div className="absolute right-[-5px] top-[140px] w-1 h-16 bg-white/30 rounded-r-md shadow-[inset_-1px_0_2px_rgba(255,255,255,0.5)]" />

                <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative shadow-inner">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-7 bg-black rounded-full z-30 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.1)] flex items-center justify-between px-3">
                     <div className="w-2 h-2 rounded-full bg-white/10" />
                     <div className="w-2 h-2 rounded-full bg-success/80 animate-pulse" />
                  </div>
                  
                  {/* Screen Background Image */}
                  <img
                    src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600&h=1200"
                    alt="Luxoria app interface"
                    className="w-full h-[60%] object-cover object-top opacity-80"
                    loading="lazy"
                  />
                  
                  {/* Screen Content UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 pb-10">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-accent text-[10px] uppercase tracking-widest font-bold mb-1">Your Rental</p>
                          <p className="text-white font-bold text-2xl">BMW M8 Comp</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-lg">
                           <MapPin className="w-5 h-5 text-accent" />
                        </div>
                      </div>
                      
                      {/* Swipe to unlock mockup UI */}
                      <div className="w-full h-14 bg-surface rounded-full border border-border flex items-center p-1.5 relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-50" />
                        <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center z-10 shadow-md">
                           <Car className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-primary font-bold text-xs uppercase tracking-widest absolute w-full text-center pointer-events-none">Slide to Unlock</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Notification Card 1 (Live Booking) */}
              <motion.div
                animate={{ y: [0, -10, 0], z: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 -left-24 glass-dark p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 w-[240px] z-20 backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                    <CalendarCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-white mb-0.5">Booking Confirmed</p>
                    <p className="text-caption text-white/60 leading-tight">Your driver is en route with the Bentley.</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Notification Card 2 (Payment Success) */}
              <motion.div
                animate={{ y: [0, 15, 0], z: [0, 30, 0] }}
                transition={{ duration: 6, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-40 -right-16 glass-dark p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 w-[200px] z-20 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-caption font-bold text-white uppercase tracking-wider">Payment</p>
                </div>
                <p className="text-body font-bold text-white">$85,000</p>
                <p className="text-[10px] text-white/40">Processed securely</p>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
