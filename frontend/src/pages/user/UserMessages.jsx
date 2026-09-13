import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bell, Car, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const UPCOMING = [
  { icon: MessageSquare, title: 'Real-time Chat', desc: 'Message vendors directly about your booking details, pickup instructions, and special requests.' },
  { icon: Bell,          title: 'Instant Alerts', desc: 'Get notified the moment a vendor responds or updates your reservation status.' },
  { icon: Car,           title: 'Booking Context', desc: 'Every conversation is linked to your booking so all details are in one place.' },
];

export default function UserMessages() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Messages
        </h1>
        <p className="text-[#666666] text-sm font-medium tracking-wide">Secure communication with vendors and your concierge.</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C9A75D] via-[#E8D090] to-[#C9A75D]" />

        <div className="flex flex-col items-center text-center px-8 py-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-[#C9A75D]" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#0F0F0F] flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-[#C9A75D]" />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 text-[11px] font-bold uppercase tracking-widest text-[#C9A75D] mb-5">
            Coming Soon
          </span>

          <h2 className="text-[24px] font-bold text-[#0F0F0F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Messaging is on its way
          </h2>
          <p className="text-[14px] text-[#666666] max-w-lg mx-auto leading-relaxed mb-10">
            We're building a seamless in-app messaging experience so you can communicate directly with vendors, get real-time booking updates, and have all your conversations in one place.
          </p>

          {/* Feature previews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl mb-10">
            {UPCOMING.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3 p-5 bg-[#F9F9F9] rounded-2xl border border-[#F0F0F0]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#ECECEC] shadow-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C9A75D]" />
                </div>
                <h4 className="text-[13px] font-bold text-[#0F0F0F]">{title}</h4>
                <p className="text-[12px] text-[#666666] leading-relaxed text-center">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/support"
              className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-7 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" /> Contact Support
            </Link>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] px-7 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest border border-[#ECECEC] hover:border-[#C9A75D] hover:text-[#C9A75D] transition-all"
            >
              <Bell className="w-4 h-4" /> View Notifications
            </Link>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
