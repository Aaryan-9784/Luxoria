import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { 
  PhoneCall, Mail, ChevronDown, 
  Send, CheckCircle2, AlertCircle, FileText, Sparkles
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
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
  const [ticketInquiryType, setTicketInquiryType] = useState('');
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
        inquiryType: ticketInquiryType,
        message: ticketMessage,
      });

      setSubmitSuccess(true);
      setTicketSubject('');
      setTicketMessage('');
      setTicketInquiryType('');

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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
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
            <a href="tel:+919979016491" className="relative overflow-hidden bg-white border border-[#ECECEC] rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-500 group cursor-pointer block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A75D]/5 rounded-full blur-3xl group-hover:bg-[#C9A75D]/10 transition-all duration-500"></div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 text-[#C9A75D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-[0.2em] mb-1.5">VIP Concierge</p>
                  <h4 className="text-[18px] font-bold text-[#0F0F0F] mb-2 tracking-wide">+91 99790 16491</h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed">Available 24/7 for active bookings and immediate assistance.</p>
                </div>
              </div>
            </a>
            
            <a href="mailto:aryanpatel5941@gmail.com" className="relative overflow-hidden bg-white border border-[#ECECEC] rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-500 group cursor-pointer block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A75D]/5 rounded-full blur-3xl group-hover:bg-[#C9A75D]/10 transition-all duration-500"></div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 text-[#C9A75D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-[0.2em] mb-1.5">General Support</p>
                  <h4 className="text-[15px] font-bold text-[#0F0F0F] mb-2 tracking-wide truncate">aryanpatel5941@gmail.com</h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed">Expect a response from our client team within 1-2 hours.</p>
                </div>
              </div>
            </a>
          </motion.div>

          {/* FAQs */}
          <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-[#ECECEC] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#C9A75D]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0F0F0F] tracking-tight uppercase tracking-widest">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-[#ECECEC]">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="group">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className={`w-full text-left px-6 lg:px-8 py-6 flex items-center justify-between focus:outline-none transition-colors duration-300 ${openFaqIndex === idx ? 'bg-[#F5F5F5]/50' : 'hover:bg-[#F5F5F5]/30'}`}
                  >
                    <span className={`text-[14px] font-bold pr-8 transition-colors ${openFaqIndex === idx ? 'text-[#C9A75D]' : 'text-[#0F0F0F]'}`}>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-[#C9A75D]' : 'text-[#9CA3AF]'}`} />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F5F5F5]/50"
                      >
                        <div className="px-6 lg:px-8 pb-6 pt-2 text-[13px] leading-relaxed text-[#666666]">
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

        {/* Right Column: Premium Ticket Form */}
        <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden h-max sticky top-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C9A75D]/5 to-transparent pointer-events-none"></div>
          
          <div className="p-8 border-b border-[#ECECEC] flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C9A75D]" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#0F0F0F] tracking-widest uppercase">Client Request</h3>
              <p className="text-[#666666] text-[11px] uppercase tracking-wider mt-1">Open a Ticket</p>
            </div>
          </div>
          
          <div className="p-8 relative z-10">
            {submitSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
                </div>
                <h4 className="text-[22px] font-bold text-[#0F0F0F] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Ticket Submitted</h4>
                <p className="text-[13px] text-[#666666] leading-relaxed max-w-[250px]">Our concierge team has received your request and will reach out shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#0F0F0F] uppercase tracking-[0.2em] mb-2.5">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your request"
                    className="w-full bg-[#F5F5F5] border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3.5 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/50 transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#0F0F0F] uppercase tracking-[0.2em] mb-2.5">Inquiry Type</label>
                  <CustomSelect
                    value={ticketInquiryType}
                    onChange={setTicketInquiryType}
                    options={[
                      { value: 'general_question',      label: 'General Question' },
                      { value: 'booking_modification',  label: 'Booking Modification' },
                      { value: 'booking_cancellation',  label: 'Booking Cancellation' },
                      { value: 'payment_billing',       label: 'Payment & Billing' },
                      { value: 'vehicle_inquiry',       label: 'Vehicle Inquiry' },
                      { value: 'chauffeur_service',     label: 'Chauffeur Service' },
                      { value: 'urgent_assistance',     label: 'Urgent Assistance' },
                    ]}
                    placeholder="Select inquiry type"
                    variant="field"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#0F0F0F] uppercase tracking-[0.2em] mb-2.5">Detailed Message</label>
                  <textarea 
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="How can we assist you today?"
                    className="w-full bg-[#F5F5F5] border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3.5 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/50 transition-all placeholder:text-[#9CA3AF] min-h-[160px] resize-y"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0F0F0F] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#1A1A1A] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Send Message'} <Send className="w-4 h-4" />
                  </button>
                  {submitError && (
                    <p className="mt-3 text-[12px] text-red-500 font-medium text-center">{submitError}</p>
                  )}
                  <div className="mt-5 p-4 bg-[#F5F5F5] border border-[#ECECEC] rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#666666] shrink-0" />
                    <p className="text-[10px] font-medium text-[#666666] uppercase tracking-wider leading-relaxed">For urgent active booking issues, please call the VIP Concierge line directly.</p>
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
