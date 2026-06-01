import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Car, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(resetPassword({ token, password: data.password }));
    
    if (resetPassword.fulfilled.match(result)) {
      setSuccess(true);
    } else {
      setErrorMsg(result.payload || 'Invalid or expired token.');
    }
    setLoading(false);
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
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=100&w=2400"
          alt="Luxurious sports car"
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
            <h1 className="auth-headline" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', lineHeight: '1.1', marginBottom: '24px' }}>
              Secure Your<br />
              <span className="auth-headline-gold">Account</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.8)' }}>
              Enter a new strong password to regain access to your exclusive luxury automotive experience.
            </p>
          </motion.div>
          
          <div />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — Reset Password Form
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

          {!success ? (
            <>
              {/* Header */}
              <div className="auth-card-header">
                <h2 className="auth-card-title">Set New Password</h2>
                <p className="auth-card-subtitle">
                  Please enter your new password below.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && <Alert type="error" className="mb-6">{errorMsg}</Alert>}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* New Password */}
                <div className="auth-input-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="password"
                      id="reset-password"
                      placeholder="New Password"
                      className={`auth-input ${errors.password ? 'has-error' : ''}`}
                      {...register('password', { 
                        required: 'Password is required',
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: 'Must contain uppercase, lowercase, number and special char',
                        }
                      })}
                    />
                    <label htmlFor="reset-password" className="auth-floating-label">New Password</label>
                    <Lock className="auth-input-icon" />
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
                      type="password"
                      id="reset-confirm-password"
                      placeholder="Confirm New Password"
                      className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                      {...register('confirmPassword', { 
                        required: 'Please confirm password',
                        validate: (val) => val === newPassword || 'Passwords do not match'
                      })}
                    />
                    <label htmlFor="reset-confirm-password" className="auth-floating-label">Confirm New Password</label>
                    <Lock className="auth-input-icon" />
                  </div>
                  {errors.confirmPassword && (
                    <div className="auth-input-error">
                      <span>{errors.confirmPassword.message}</span>
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
                      Reset Password
                      <ArrowRight className="w-5 h-5 btn-arrow" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(132, 204, 22, 0.1)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#84cc16' }} />
              </div>
              <h2 className="auth-card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Password Reset!</h2>
              <p className="auth-card-subtitle" style={{ marginBottom: '32px' }}>
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
              <button onClick={() => navigate('/login')} className="auth-submit-btn">
                Go to Sign In
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
