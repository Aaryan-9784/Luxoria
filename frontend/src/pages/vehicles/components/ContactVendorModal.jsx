import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactVendorModal({ isOpen, onClose, vehicle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use the new endpoint we created in the backend
      const response = await fetch('http://localhost:5000/api/contact/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle?._id || vehicle?.id,
          vehicleName: vehicle?.brand ? `${vehicle.brand} ${vehicle.model || vehicle.name}` : vehicle?.name,
          vendorName: vehicle?.vendor?.name,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send inquiry');
      }

      setSuccess(true);
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-background rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border">
                <div>
                  <h3 className="text-h4 font-bold text-primary mb-1">Contact Vendor</h3>
                  <p className="text-body-sm text-secondary">
                    Inquire about the {vehicle?.brand} {vehicle?.model || vehicle?.name?.replace(vehicle?.brand, '')}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-h5 font-bold text-primary mb-2">Inquiry Sent Successfully</h4>
                    <p className="text-secondary text-body-sm max-w-xs">
                      We have notified the vendor and our concierge team. They will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                        <p className="text-body-sm text-error font-medium">{error}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-caption text-primary font-semibold mb-2 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-primary focus:outline-none focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-caption text-primary font-semibold mb-2 uppercase tracking-wide">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-primary focus:outline-none focus:border-accent transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-caption text-primary font-semibold mb-2 uppercase tracking-wide">Phone</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-primary focus:outline-none focus:border-accent transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-caption text-primary font-semibold mb-2 uppercase tracking-wide">Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder="Hello, I would like to know more about..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-primary text-white rounded-xl font-semibold uppercase tracking-wider hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Inquiry <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
