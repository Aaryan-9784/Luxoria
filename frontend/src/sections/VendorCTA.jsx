import React from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXE, staggerContainer, staggerItem } from '@/lib/motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, DollarSign, Activity, PieChart, Bell, Shield } from 'lucide-react';
import { SectionHeader } from '@/components/ui/Typography';

export default function VendorCTA() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative gradient for fintech feel */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE_LUXE }}
          >
            <span className="text-overline text-accent mb-4 block tracking-[0.2em] uppercase">Partner With Us</span>
            <h2 className="text-h1 text-primary mb-6 leading-[1.1] font-light">
              <span className="font-bold">Monetize Your Assets.</span><br />
              Business-Class Returns.
            </h2>
            <p className="text-lg text-secondary leading-relaxed mb-10 font-light max-w-lg">
              Join the most exclusive network of premium vehicle owners. Our fintech-grade platform provides real-time analytics, instant payouts, and unparalleled asset protection.
            </p>

            {/* Vendor benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: TrendingUp, label: 'Predictable Yield', desc: 'Optimize your fleet utilization with AI-driven pricing.' },
                { icon: Shield, label: 'Ironclad Protection', desc: '$5M liability insurance on every single booking.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-body font-bold text-primary mb-1">{item.label}</h4>
                    <p className="text-caption text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/vendor/signup" className="btn btn-primary btn-xl rounded-full shadow-lg hover:-translate-y-1 transition-transform group">
                Start Earning <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-xl rounded-full">
                View Prospectus
              </Link>
            </div>
          </motion.div>

          {/* ── Right: Fintech Dashboard Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: EASE_LUXE }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Background mockup glow */}
            <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

            {/* Main Dashboard Card */}
            <div className="relative w-full max-w-md bg-background rounded-3xl border border-border/60 shadow-2xl overflow-hidden z-10">
              <div className="bg-surface/50 p-6 border-b border-border flex justify-between items-center">
                <div>
                  <p className="text-caption text-secondary uppercase tracking-widest font-semibold mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary tracking-tight">₹4,250,000</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm relative">
                  <Bell className="w-5 h-5 text-secondary" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                </div>
              </div>
              <div className="p-6">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Chart" className="w-full h-40 object-cover rounded-xl opacity-80 mix-blend-luminosity mb-6" />
                
                <div className="flex justify-between items-center py-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                      <PieChart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-primary">Fleet Utilization</p>
                      <p className="text-caption text-secondary">Last 30 days</p>
                    </div>
                  </div>
                  <span className="text-body font-bold text-success">84%</span>
                </div>
              </div>
            </div>

            {/* Floating Card: Live Activity */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 top-16 glass-card p-4 rounded-2xl shadow-float z-20 w-64 border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-caption font-bold text-primary uppercase tracking-widest">Live Booking</span>
              </div>
              <p className="text-body-sm text-secondary">Porsche 911 GT3 RS just booked for 3 days.</p>
              <p className="text-caption font-bold text-success mt-2">+₹45,000 Expected</p>
            </motion.div>

            {/* Floating Card: Vendor Payout */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 bottom-20 glass-card p-5 rounded-2xl shadow-float z-20 border border-border"
            >
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-caption text-muted uppercase tracking-widest font-semibold mb-1">Next Payout</p>
                  <p className="text-xl font-bold text-primary tracking-tight">₹1,250,000</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Ensure Shield is imported properly if not already (it wasn't in original lucide-react import list for this file)
// Let's modify the import above to include Shield.
