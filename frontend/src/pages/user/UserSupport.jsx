import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { 
  MessageSquare, PhoneCall, Mail, ChevronDown, 
  Send, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';
import api from '@/services/api';

const FAQS = [
  {
    question: "How do I modify or cancel a booking?",
    answer: "You can modify or cancel your booking through the 'My Bookings' section. Please note that cancellations within 48 hours of the scheduled pickup time may be subject to a cancellation fee. For urgent modifications, please contact our VIP Concierge directly."
  },
  {
    question: "What is your policy on security deposits?",
    answer: "A pre-authorization is required on a major credit card 24 hours prior to your rental period. The amount varies based on the vehicle class. This hold is released immediately upon the safe return of the vehicle, though your bank may take 3-5 business days to process the release."
  },
  {
    question: "Can I request a professional chauffeur?",
    answer: "Absolutely. We offer elite chauffeur services for all our vehicles. You can add this option during the booking process or contact our support team to upgrade an existing reservation. All chauffeurs are highly trained, rigorously vetted, and guarantee total discretion."
  },
  {
    question: "Are there mileage limits for exotic rentals?",
    answer: "Most of our exotic and luxury vehicles include a complimentary 100 miles per day. Additional mileage is billed per mile according to the vehicle's specific tier. Detailed mileage allowances are provided on each vehicle's details page."
  }
];

export default function UserSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/contact/support-ticket', {
        subject: ticketSubject,
        priority: ticketPriority,
        message: ticketMessage,
      });

      setSubmitSuccess(true);
      setTicketSubject('');
      setTicketMessage('');
      setTicketPriority('normal');

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'Failed to send your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Client Support Center</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Get assistance with your bookings, account, and personalized requests.</p>
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
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">VIP Concierge</p>
                <h4 className="text-[16px] font-bold text-[#0F0F0F] mb-1">+1 (800) LUX-ORIA</h4>
                <p className="text-[12px] text-[#666666]">Available 24/7 for active bookings and immediate assistance.</p>
              </div>
            </div>
            
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0F0F0F]/5 text-[#0F0F0F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">General Support</p>
                <h4 className="text-[16px] font-bold text-[#0F0F0F] mb-1">clients@luxoria.com</h4>
                <p className="text-[12px] text-[#666666]">Expect a response from our client team within 1-2 hours.</p>
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
          <div className="p-6 border-b border-[#ECECEC] bg-[#F5F5F5]/50 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#C9A75D]" />
            <h3 className="text-[16px] font-bold text-[#0F0F0F] tracking-wider uppercase">Open a Ticket</h3>
          </div>
          
          <div className="p-6">
            {submitSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                </div>
                <h4 className="text-[18px] font-bold text-[#0F0F0F] mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Request Received</h4>
                <p className="text-[13px] text-[#666666]">Your concierge has received your request and will follow up shortly.</p>
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
                    placeholder="Brief description of your request"
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em] mb-2">Inquiry Type</label>
                  <select 
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="normal">General Question</option>
                    <option value="high">Booking Modification</option>
                    <option value="urgent">Urgent Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em] mb-2">Detailed Message</label>
                  <textarea 
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="How can we assist you today?"
                    className="w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF] min-h-[150px] resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] hover:shadow-sm disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Message'} <Send className="w-4 h-4 text-[#C9A75D]" />
                  </button>
                  {submitError && (
                    <p className="mt-3 text-[12px] text-red-500 font-medium text-center">{submitError}</p>
                  )}
                  <div className="mt-4 p-3 bg-[#C9A75D]/10 border border-[#C9A75D]/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#B59345] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-[#B59345] uppercase tracking-wider">For urgent active booking issues, please call the VIP Concierge line directly.</p>
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
