import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.payload || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="auth-page">

      {/* LEFT PANEL */}
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
              Welcome<br />
              <span className="auth-headline-gold">Back</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.8)' }}>
              Sign in to access your exclusive garage, manage reservations, and discover unparalleled luxury.
            </p>
          </motion.div>
          
          <div />
        </div>
      </div>

      {/* RIGHT PANEL */}
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
            <h2 className="auth-card-title">Sign In</h2>
            <p className="auth-card-subtitle">
              Enter your credentials to continue.
            </p>
          </div>

          {errorMsg && (
            <Alert type="error" className="mb-6">{errorMsg}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email is required' },
                  })}
                />
                <label htmlFor="email" className="auth-floating-label">Email Address</label>
                <Mail className="auth-input-icon" />
              </div>
              {errors.email && <div className="auth-input-error"><span>{errors.email.message}</span></div>}
            </div>

            {/* Password */}
            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={`auth-input ${errors.password ? 'has-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <label htmlFor="password" className="auth-floating-label">Password</label>
                <Lock className="auth-input-icon" />
              </div>
              {errors.password && <div className="auth-input-error"><span>{errors.password.message}</span></div>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#D4AF37', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider" style={{ marginTop: '32px', marginBottom: '24px' }}>
            <div className="auth-divider-line" />
            <span className="auth-divider-text">OR</span>
            <div className="auth-divider-line" />
          </div>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
