import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { 
  MessageSquare, PhoneCall, Mail, ChevronDown, 
  Send, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';

const FAQS = [
  {
    question: "How long does it take for a vehicle to be approved?",
    answer: "Our administrative team reviews all new vehicle submissions within 24-48 hours. Ensure all cinematic images and documents meet our premium quality standards to expedite the process."
  },
  {
    question: "When are payouts processed?",
    answer: "Payouts for completed trips are automatically processed every Tuesday and Friday directly to your registered bank account. Funds typically appear within 1-2 business days depending on your bank."
  },
  {
    question: "How do I handle a client dispute?",
    answer: "If a dispute arises, document the vehicle's condition thoroughly. Open a High Priority ticket through this portal within 24 hours of the trip's conclusion, and our Dedicated Partner Concierge will mediate the resolution."
  },
  {
    question: "Can I update the pricing for an active booking?",
    answer: "No, pricing for active or confirmed bookings is locked to ensure client trust. However, you can freely update your daily rates for all future dates via the Fleet Management tab."
  }
];

export default function VendorSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTicketSubject('');
      setTicketMessage('');
      setTicketPriority('normal');
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Partner Support Center</h1>
          <p className="text-[#666666] text-[13px] font-medium tracking-wide">Get assistance with your fleet, bookings, and platform tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contact Methods & FAQ */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Contact Cards */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#C9A75D]/10 text-[#C9A75D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Priority Partners</p>
                <h4 className="text-[16px] font-bold text-[#0F0F0F] mb-1">+1 (800) LUX-ORIA</h4>
                <p className="text-[12px] text-[#666666]">Available 24/7 for urgent assistance.</p>
              </div>
            </div>
            
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0F0F0F]/5 text-[#0F0F0F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">General Inquiries</p>
                <h4 className="text-[16px] font-bold text-[#0F0F0F] mb-1">partners@luxoria.com</h4>
                <p className="text-[12px] text-[#666666]">Expect a response within 4 hours.</p>
              </div>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#ECECEC] bg-[#F5F5F5]/50 flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#C9A75D]" />
              <h3 className="text-[16px] font-bold text-[#0F0F0F] tracking-tight uppercase tracking-wider">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-[#ECECEC]">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="group">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none hover:bg-[#F5F5F5]/30 transition-colors"
                  >
                    <span className="text-[14px] font-bold text-[#0F0F0F] pr-8">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-[13px] leading-relaxed text-[#666666]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Ticket Form */}
        <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden h-max sticky top-24">
          <div className="p-6 border-b border-[#ECECEC] bg-[#0F0F0F] text-white flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#C9A75D]" />
            <h3 className="text-[16px] font-bold tracking-wider uppercase">Open a Ticket</h3>
          </div>
          
          <div className="p-6">
            {submitSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                </div>
                <h4 className="text-[18px] font-bold text-[#0F0F0F] mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Ticket Submitted</h4>
                <p className="text-[13px] text-[#666666]">Our concierge team has received your request and will reach out shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em] mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em] mb-2">Priority Level</label>
                  <select 
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Time Sensitive)</option>
                    <option value="urgent">Urgent (Active Booking Issue)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em] mb-2">Detailed Message</label>
                  <textarea 
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide as much detail as possible..."
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF] min-h-[150px] resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Message'} <Send className="w-4 h-4" />
                  </button>
                  <div className="mt-4 p-3 bg-[#C9A75D]/10 border border-[#C9A75D]/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#B59345] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-[#B59345] uppercase tracking-wider">Please do not share sensitive financial information.</p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
