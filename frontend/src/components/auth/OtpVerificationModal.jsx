import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import Alert from '@/components/ui/Alert';

export default function OtpVerificationModal({ email, onVerify, onResend, onBack, themeColor = '#D4AF37' }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits are typed
    if (newOtp.every(digit => digit !== '')) {
      const fullOtp = newOtp.join('');
      submitOtp(fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
    submitOtp(pastedData);
  };

  const submitOtp = async (codeToSubmit) => {
    const fullCode = codeToSubmit || otp.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const err = await onVerify(fullCode);
      if (err) {
        setErrorMsg(err);
      }
    } catch (error) {
      setErrorMsg(error?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await onResend();
      setSuccessMsg('A new 6-digit verification code has been sent to your email.');
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMsg(error?.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Header exactly structured like Login / Register */}
      <div className="auth-card-header">
        <h2 className="auth-card-title">Two-Factor Authentication</h2>
        <p className="auth-card-subtitle">
          Enter the 6-digit code sent to <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{email}</span>
        </p>
      </div>

      {errorMsg && <Alert type="error" className="mb-6">{errorMsg}</Alert>}
      {successMsg && <Alert type="success" className="mb-6">{successMsg}</Alert>}

      <form onSubmit={(e) => { e.preventDefault(); submitOtp(); }}>
        {/* 6 Digit High-Contrast Luxury Input Group */}
        <div className="flex justify-between gap-2.5 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl transition-all duration-300 outline-none"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: digit ? `2px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                boxShadow: digit ? `0 0 16px ${themeColor}60` : '0 4px 12px rgba(0, 0, 0, 0.6)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
              }}
            />
          ))}
        </div>

        {/* Submit button using exact auth-submit-btn class */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
          style={{ width: '100%', marginBottom: '0px' }}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              Verify & Sign In
              <ArrowRight className="w-5 h-5" style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
      </form>

      {/* High contrast resend & back links */}
      <div 
        className="flex items-center justify-between w-full mt-6 pt-4 border-t border-white/15"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: '24px', 
          paddingTop: '18px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.15)' 
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.875rem', 
            color: '#FFFFFF', 
            fontWeight: 500,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.95)',
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}
          className="hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: themeColor }} />
          Back to credentials
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resendLoading}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.875rem', 
            color: timer > 0 ? 'rgba(255, 255, 255, 0.75)' : themeColor, 
            fontWeight: 600,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.95)',
            background: 'none',
            border: 'none',
            cursor: timer > 0 ? 'not-allowed' : 'pointer'
          }}
          className="transition-opacity"
        >
          <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
          {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
        </button>
      </div>
    </motion.div>
  );
}
