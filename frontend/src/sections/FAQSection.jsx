import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_LUXE } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/Typography';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'How do I book a luxury vehicle?', a: 'Simply browse our fleet, select your dates, choose your vehicle, and complete the secure checkout. Your booking is confirmed instantly, and our concierge will coordinate delivery details.' },
  { q: 'What documents do I need to rent?', a: 'You\'ll need a valid government-issued ID, a driving license (minimum 2 years), and a credit/debit card for the security deposit. International clients need an International Driving Permit.' },
  { q: 'Is insurance included in the rental?', a: 'Yes, comprehensive insurance is included with every rental. This covers collision damage, theft protection, and third-party liability. Additional premium coverage options are available.' },
  { q: 'Can I extend my rental period?', a: 'Absolutely. You can extend your rental directly from the app or by contacting our concierge. Extensions are subject to vehicle availability and are charged at the same daily rate with zero penalty fees.' },
  { q: 'How does vehicle delivery work?', a: 'We offer complimentary doorstep delivery within city limits. Your vehicle is hand-delivered, fully detailed, and sanitized. Our team will walk you through the vehicle features before handover.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 24 hours before your pickup time. Cancellations within 24 hours incur a 15% charge. No-shows are charged at 50% of the booking value.' },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className={cn("rounded-2xl transition-all duration-500 overflow-hidden", isOpen ? "glass-card shadow-lg border border-border" : "bg-transparent border border-transparent hover:border-border/50")}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 px-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className={cn("text-body font-bold transition-colors pr-4", isOpen ? "text-accent" : "text-primary group-hover:text-accent")}>
          {faq.q}
        </span>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0", isOpen ? "bg-accent text-white" : "bg-surface group-hover:bg-accent/10 text-muted group-hover:text-accent")}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
          >
            <div className="px-6 pb-6 pt-2">
              <div className="w-full h-px bg-gradient-to-r from-accent/20 to-transparent mb-4" />
              <p className="text-body-sm text-secondary leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            overline="FAQ"
            title="Questions & Answers"
            description="Everything you need to know about experiencing the Luxoria standard."
            align="center"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
            className="mb-10"
          >
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-full py-4 pl-14 pr-6 text-primary shadow-sm focus:outline-none focus:border-accent focus:shadow-glow-gold transition-all"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_LUXE }}
            className="flex flex-col gap-3"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-secondary">No answers found for "{searchQuery}". Please contact our concierge.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
