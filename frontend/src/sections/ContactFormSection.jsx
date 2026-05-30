import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const inputClasses = "w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-accent text-primary transition-colors duration-300 peer placeholder-transparent";
  const labelClasses = "absolute left-0 top-4 text-secondary text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary pointer-events-none";

  return (
    <section id="contact-form" className="py-[140px] bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1000px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-16 border border-border rounded-sm shadow-2xl relative"
        >
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Inquiry Sent Successfully</h3>
              <p className="text-secondary mb-8">Our concierge team will contact you shortly to curate your experience.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-accent hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors"
              >
                Send Another Inquiry
              </button>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-4 tracking-tight">Request an <span className="text-secondary italic font-light lowercase">Experience</span></h3>
                <p className="text-secondary max-w-lg mx-auto">Please provide your details below, and our specialists will arrange a bespoke luxury experience tailored to your exact specifications.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input type="text" id="firstName" className={inputClasses} placeholder="First Name" required />
                    <label htmlFor="firstName" className={labelClasses}>First Name</label>
                  </div>
                  <div className="relative">
                    <input type="text" id="lastName" className={inputClasses} placeholder="Last Name" required />
                    <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                  </div>
                  <div className="relative">
                    <input type="email" id="email" className={inputClasses} placeholder="Email Address" required />
                    <label htmlFor="email" className={labelClasses}>Email Address</label>
                  </div>
                  <div className="relative">
                    <input type="tel" id="phone" className={inputClasses} placeholder="Phone Number" required />
                    <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                  </div>
                  <div className="relative">
                    <input type="text" id="city" className={inputClasses} placeholder="City" required />
                    <label htmlFor="city" className={labelClasses}>City</label>
                  </div>
                  <div className="relative">
                    <select id="serviceType" className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-accent text-primary transition-colors duration-300 appearance-none required:invalid:text-secondary">
                      <option value="" disabled selected hidden>Select Service Type</option>
                      <option value="rental">Luxury Rental</option>
                      <option value="chauffeur">Chauffeur Service</option>
                      <option value="wedding">Wedding Package</option>
                      <option value="corporate">Corporate Event</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-l-[5px] border-r-[5px] border-t-primary border-l-transparent border-r-transparent"></div>
                  </div>
                  <div className="relative">
                    <input type="text" id="preferredVehicle" className={inputClasses} placeholder="Preferred Vehicle (Optional)" />
                    <label htmlFor="preferredVehicle" className={labelClasses}>Preferred Vehicle (Optional)</label>
                  </div>
                  <div className="relative">
                    <input type="date" id="eventDate" className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-accent text-primary transition-colors duration-300 required:invalid:text-secondary" required />
                  </div>
                </div>

                <div className="relative">
                  <textarea id="message" rows="4" className={`${inputClasses} resize-none`} placeholder="Additional Details or Special Requests"></textarea>
                  <label htmlFor="message" className={labelClasses}>Additional Details or Special Requests</label>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center items-center gap-4 py-5 bg-[#050505] text-white rounded-[2px] overflow-hidden transition-all duration-700 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#050505] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
                    <span className="relative z-10 font-bold tracking-[0.25em] uppercase text-[12px] group-hover:text-[#E5C76B] transition-colors duration-700">
                      {isSubmitting ? 'Processing...' : 'Send Inquiry'}
                    </span>
                    {!isSubmitting && <Send className="relative z-10 w-4 h-4 text-white/80 group-hover:text-[#E5C76B] group-hover:translate-x-1 transition-all duration-700" />}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
