import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, clearError } from '@/redux/slices/authSlice';
import {
  Car, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff,
  ShieldCheck, CheckCircle, Fingerprint, Globe, Crown, Check,
  Sparkles, Zap, Gift, Clock, Star, Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import Alert from '@/components/ui/Alert';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword: _, ...submitData } = data;
    const result = await dispatch(registerUser({ ...submitData, role: 'user' }));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  const handleGoogleSignup = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <motion.div {...pageTransition} className="auth-page">

      {/* ════════════════════════════════════════════════════════════════════
          LEFT PANEL — Cinematic Luxury Showcase
          ════════════════════════════════════════════════════════════════════ */}
      <div className="auth-left-panel hidden md:flex">
        {/* Background Image */}
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=100&w=2400"
          alt="Bugatti luxury vehicle"
          className="auth-bg-image loaded"
          loading="eager"
        />

        {/* Overlays */}
        <div className="auth-overlay-dark" />
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
            <span className="auth-logo-text">Luxoria</span>
          </Link>

          {/* Headline */}
          <motion.div
            className="auth-headline-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE_LUXE }}
          >
            <h1 className="auth-headline">
              Begin Your Luxury<br />
              <span className="auth-headline-gold">Journey</span>
            </h1>
            <p className="auth-subheadline">
              Join an exclusive community of discerning automotive enthusiasts. Unlock premium vehicles and unparalleled concierge service.
            </p>

            {/* Benefits — inside left panel for space efficiency */}
            <motion.div
              className="auth-benefits-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                marginTop: '24px',
                borderLeft: '1px solid rgba(212, 175, 55, 0.4)',
                paddingLeft: '24px'
              }}
            >
              <div className="auth-benefits-title" style={{ color: '#D4AF37', fontSize: '0.875rem' }}>
                <Crown className="w-[16px] h-[16px]" style={{ color: '#D4AF37' }} />
                Why Join Luxoria
              </div>
              <div className="auth-benefits-grid" style={{ gap: '12px 8px' }}>
                {[
                  { icon: Sparkles, label: 'Priority Reservations' },
                  { icon: Star, label: 'Exclusive Luxury Fleet' },
                  { icon: Zap, label: 'VIP Concierge Service' },
                  { icon: Gift, label: 'Premium Rewards' },
                  { icon: Clock, label: 'Faster Checkout' },
                  { icon: Bookmark, label: 'Exclusive Offers' },
                ].map((benefit) => (
                  <div key={benefit.label} className="auth-benefit-item" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    <div className="auth-benefit-check" style={{ background: 'transparent', padding: 0 }}>
                      <benefit.icon className="w-[18px] h-[18px]" style={{ color: '#D4AF37' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 300, letterSpacing: '0.02em' }}>{benefit.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="auth-stats-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: EASE_LUXE }}
          >
            {[
              { value: '10,000+', label: 'Premium Members' },
              { value: '500+', label: 'Luxury Vehicles' },
              { value: '50+', label: 'Global Locations' },
              { value: '24/7', label: 'Concierge Support' },
            ].map((stat) => (
              <div key={stat.label} className="auth-stat-card">
                <div className="auth-stat-value">{stat.value}</div>
                <div className="auth-stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — Registration Form
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
            <h2 className="auth-card-title">Create Your Account</h2>
            <p className="auth-card-subtitle">
              Join the exclusive world of luxury automotive experiences
            </p>
          </div>

          {/* Error Alert */}
          {error && <Alert type="error" className="mb-4">{error}</Alert>}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="auth-google-btn"
            id="register-google-btn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Or continue with email</span>
            <div className="auth-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="register-name"
                  placeholder="Full Name"
                  className={`auth-input ${errors.name ? 'has-error' : ''}`}
                  {...register('name', { required: 'Full name is required' })}
                />
                <label htmlFor="register-name" className="auth-floating-label">Full Name</label>
                <UserIcon className="auth-input-icon" />
              </div>
              {errors.name && (
                <div className="auth-input-error">
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  id="register-email"
                  placeholder="Email Address"
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                />
                <label htmlFor="register-email" className="auth-floating-label">Email Address</label>
                <Mail className="auth-input-icon" />
              </div>
              {errors.email && (
                <div className="auth-input-error">
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  placeholder="Password"
                  className={`auth-input ${errors.password ? 'has-error' : ''}`}
                  style={{ paddingRight: '48px' }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                  })}
                />
                <label htmlFor="register-password" className="auth-floating-label">Password</label>
                <Lock className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                </button>
              </div>
              {errors.password && (
                <div className="auth-input-error">
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="register-confirm-password"
                  placeholder="Confirm Password"
                  className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                  style={{ paddingRight: '48px' }}
                  {...register('confirmPassword', {
                    required: 'Confirm password',
                    validate: (value) => value === password || 'Passwords don\'t match',
                  })}
                />
                <label htmlFor="register-confirm-password" className="auth-floating-label">Confirm Password</label>
                <Lock className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="auth-input-error">
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="auth-terms">
              <input
                type="checkbox"
                className="auth-checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                id="accept-terms"
                style={{ marginTop: '1px' }}
              />
              <label htmlFor="accept-terms" className="auth-terms-text">
                I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !acceptTerms}
              id="register-submit-btn"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 btn-arrow" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
