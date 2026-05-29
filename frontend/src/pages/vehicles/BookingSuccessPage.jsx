import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyPayment, clearBookingState } from '@/redux/slices/bookingSlice';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Home, Car } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import Button from '@/components/ui/Button';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  // Extract Razorpay response from navigation state
  const { paymentResponse, bookingId } = location.state || {};

  useEffect(() => {
    if (!paymentResponse || !bookingId) {
      navigate('/dashboard');
      return;
    }

    const verify = async () => {
      const result = await dispatch(verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      }));

      if (verifyPayment.fulfilled.match(result)) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.payload || 'Failed to verify payment signature.');
      }
    };

    verify();

    return () => {
      dispatch(clearBookingState());
    };
  }, [dispatch, paymentResponse, bookingId, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full" />
        </motion.div>
        <p className="text-h4 text-primary mt-8 animate-pulse">Securing your reservation...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-error text-4xl">!</span>
        </div>
        <h1 className="text-h2 text-primary mb-4">Verification Failed</h1>
        <p className="text-secondary mb-8">{errorMsg}</p>
        <Button onClick={() => navigate('/dashboard')} size="lg">Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="min-h-screen pt-32 pb-20 bg-surface flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="glass-card-elevated p-10 md:p-14 text-center rounded-3xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-radial from-success/10 to-transparent" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10"
          >
            <CheckCircle2 className="w-12 h-12 text-success" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: EASE_LUXE }}
            className="text-display text-primary mb-4 leading-tight"
          >
            Reservation <br /> <span className="text-gradient-gold">Confirmed</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: EASE_LUXE }}
            className="text-lg text-secondary mb-10"
          >
            Your luxury vehicle has been secured. A confirmation email with the itinerary has been sent to your inbox.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: EASE_LUXE }}
            className="p-6 rounded-2xl bg-background border border-border flex items-center justify-between mb-10 text-left"
          >
            <div>
              <p className="text-caption text-muted uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-h4 text-primary">{bookingId.substring(0, 8).toUpperCase()}</p>
            </div>
            <button className="btn-icon">
              <Download className="w-5 h-5 text-accent" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, ease: EASE_LUXE }}
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
          >
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Home className="w-5 h-5 mr-2" /> View Dashboard
            </Link>
            <Link to="/vehicles" className="btn btn-outline btn-lg">
              <Car className="w-5 h-5 mr-2" /> Explore More
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
