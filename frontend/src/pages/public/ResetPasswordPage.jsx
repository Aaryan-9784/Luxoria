import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Car, Lock, ArrowRight } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(resetPassword({ token, password: data.password }));
    
    if (resetPassword.fulfilled.match(result)) {
      navigate('/login');
    } else {
      setErrorMsg(result.payload || 'Failed to reset password. The link might be expired.');
    }
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="auth-page">
      <div className="auth-left-panel hidden md:flex">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=100&w=2400"
          alt="Luxurious sports car"
          className="auth-bg-image loaded"
          loading="eager"
        />
        <div className="auth-overlay-dark" />
        <div className="auth-overlay-gold" />
        <div className="auth-overlay-vignette" />
        <div className="auth-ambient-light" />
        <div className="auth-particles">
          {[...Array(8)].map((_, i) => <div key={i} className="auth-particle" />)}
        </div>
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text">Luxoria</span>
          </Link>
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
              Create a new secure password to regain access to your Luxoria profile.
            </p>
          </motion.div>
          <div />
        </div>
      </div>

      <div className="auth-right-panel">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE_LUXE }}
        >
          <Link to="/" className="auth-mobile-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text">Luxoria</span>
          </Link>

          <div className="auth-card-header">
            <h2 className="auth-card-title">New Password</h2>
            <p className="auth-card-subtitle">Enter your new password below.</p>
          </div>

          {errorMsg && (
            <Alert type="error" className="mb-6">{errorMsg}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Password */}
            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  id="password"
                  placeholder="New Password"
                  className={`auth-input ${errors.password ? 'has-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  })}
                />
                <label htmlFor="password" className="auth-floating-label">New Password</label>
                <Lock className="auth-input-icon" />
              </div>
              {errors.password && <div className="auth-input-error"><span>{errors.password.message}</span></div>}
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group" style={{ marginBottom: '24px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <label htmlFor="confirmPassword" className="auth-floating-label">Confirm Password</label>
                <Lock className="auth-input-icon" />
              </div>
              {errors.confirmPassword && <div className="auth-input-error"><span>{errors.confirmPassword.message}</span></div>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Reset Password <ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: '24px' }}>
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
