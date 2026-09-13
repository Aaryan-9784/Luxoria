import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: 'How can I rent a luxury car?',
    answer: 'Renting a luxury vehicle with Luxoria is a seamless experience. You can submit an inquiry through our booking form, contact our 24/7 concierge directly, or browse our collection online to initiate the reservation process.'
  },
  {
    question: 'Do you provide chauffeur services?',
    answer: 'Yes, we offer premium chauffeur services across all our locations. Our chauffeurs are highly trained professionals dedicated to providing a discreet, comfortable, and luxurious journey.'
  },
  {
    question: 'Can vehicles be delivered?',
    answer: 'Absolutely. We provide white-glove doorstep delivery and collection services to your hotel, private residence, or airport terminal for ultimate convenience.'
  },
  {
    question: 'What documents are required?',
    answer: 'To reserve a vehicle, you must provide a valid driving license, a passport or national ID card, and a credit card for the security deposit. International renters may require an International Driving Permit (IDP).'
  },
  {
    question: 'Do you offer wedding packages?',
    answer: 'Yes, our bespoke Wedding Collection includes pristine vehicles perfect for your special day. We can arrange floral decorations, ribbons, and a dedicated chauffeur tailored to your exact requirements.'
  },
  {
    question: 'Are luxury memberships available?',
    answer: 'We offer an exclusive membership program that provides priority bookings, complimentary upgrades, waived security deposits, and access to private automotive events. Please contact our concierge for membership tiers and applications.'
  }
];

export default function ContactFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-[140px] bg-surface relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1000px]">
        
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
            <span className="text-overline tracking-[0.2em] text-primary">Inquiries</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Frequently Asked <span className="text-secondary italic font-light lowercase">Questions</span>
          </motion.h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border border-border rounded-sm bg-white overflow-hidden transition-colors duration-300 ${isActive ? 'border-accent/50' : 'hover:border-border-dark'}`}
              >
                <button
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setActiveIndex(isActive ? null : index)}
                >
                  <span className={`text-lg font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-accent' : 'text-primary'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? 'bg-accent border-accent text-white' : 'border-border text-primary'}`}>
                    {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 text-secondary leading-relaxed border-t border-border/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
