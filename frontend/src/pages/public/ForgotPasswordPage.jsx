import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthImage from '@/components/ui/AuthImage';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Car, Mail, ArrowLeft, Send } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(forgotPassword(data.email));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess(true);
    } else {
      setErrorMsg(result.payload || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      {...pageTransition} 
      className="auth-page"
      style={{
        '--auth-theme-hex': '#CBD5E1',
        '--auth-theme-hex-light': '#FFFFFF',
        '--auth-theme-rgb': '203, 213, 225'
      }}
    >

      {/* ════════════════════════════════════════════════════════════════════
          LEFT PANEL — Cinematic Luxury Showcase
          ════════════════════════════════════════════════════════════════════ */}
      <div className="auth-left-panel hidden md:flex">
        {/* Background Image */}
        <AuthImage
          src="https://wallpaperaccess.com/full/1125043.jpg"
          alt="Luxurious sports car"
        />

        {/* Overlays */}
        <div className="auth-overlay-gold" />
        <div className="auth-overlay-vignette" />
        <div className="auth-ambient-light" />

        {/* Floating Particles */}
        <div className="auth-particles">
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
        </div>

        {/* Content */}
        <div className="auth-left-content">
          {/* Logo */}
          <Link to="/" className="auth-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>Luxoria</span>
          </Link>

          {/* Headline */}
          <motion.div
            className="auth-headline-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE_LUXE }}
          >
            <h1 className="auth-headline" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', lineHeight: '1.1', marginBottom: '24px', textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 4px 30px rgba(0,0,0,0.5)' }}>
              Recover Your<br />
              <span className="auth-headline-gold">Access</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)' }}>
              Enter your email to receive secure instructions on resetting your password. Rejoin the world of automotive elegance.
            </p>
          </motion.div>
          
          {/* Empty spacer for flex layout balance */}
          <div />
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — Forgot Password Form
          ════════════════════════════════════════════════════════════════════ */}
      <div className="auth-right-panel">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE_LUXE }}
        >
          {/* Mobile Logo */}
          <Link to="/" className="auth-mobile-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text">Luxoria</span>
          </Link>

          {/* Header */}
          <div className="auth-card-header">
            <h2 className="auth-card-title">Reset Password</h2>
            <p className="auth-card-subtitle">
              We'll send you a secure link to reset your password.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <Alert type="error" className="mb-6">{errorMsg}</Alert>
          )}

          {!success ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="auth-input-group">
                <div className="auth-input-wrapper">
                  <input
                    type="email"
                    id="reset-email"
                    placeholder="Email Address"
                    className={`auth-input ${errors.email ? 'has-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' },
                    })}
                  />
                  <label htmlFor="reset-email" className="auth-floating-label">Email Address</label>
                  <Mail className="auth-input-icon" />
                </div>
                {errors.email && (
                  <div className="auth-input-error">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
                style={{ marginTop: '24px' }}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    Send Reset Link
                    <Send className="w-5 h-5" style={{ marginLeft: '8px' }} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(132, 204, 22, 0.1)' }}>
                <Mail className="w-8 h-8" style={{ color: '#84cc16' }} />
              </div>
              <h2 className="auth-card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Check your email</h2>
              <p className="auth-card-subtitle" style={{ marginBottom: '32px' }}>
                We've sent a password reset link to your email address. Please check your inbox and spam folder.
              </p>
            </div>
          )}

          {/* Switch to Login */}
          <div className="auth-divider" style={{ marginTop: '32px', marginBottom: '24px' }}>
            <div className="auth-divider-line" />
          </div>
          
          <p className="auth-switch">
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
