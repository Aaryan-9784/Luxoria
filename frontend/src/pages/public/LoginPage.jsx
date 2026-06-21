import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthImage from '@/components/ui/AuthImage';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      const userRole = result.payload?.user?.role;
      const defaultPath = userRole === 'admin' ? '/admin/dashboard'
        : userRole === 'vendor' ? '/vendor/dashboard'
        : '/dashboard';
      const targetPath = location.state?.from?.pathname !== '/' && location.state?.from?.pathname ? location.state.from.pathname : defaultPath;
      navigate(targetPath, { replace: true });
    } else {
      setErrorMsg(result.payload || 'Invalid credentials');
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

      {/* LEFT PANEL */}
      <div className="auth-left-panel hidden md:flex">
        <AuthImage
          src="https://images.alphacoders.com/127/1271987.jpg"
          alt="Luxurious sports car"
        />


        <div className="auth-overlay-gold" />
        <div className="auth-overlay-vignette" />
        <div className="auth-ambient-light" />

        <div className="auth-particles">
          {[...Array(8)].map((_, i) => <div key={i} className="auth-particle" />)}
        </div>

        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>Luxoria</span>
          </Link>

          <motion.div
            className="auth-headline-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE_LUXE }}
          >
            <h1 className="auth-headline" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', lineHeight: '1.1', marginBottom: '24px', textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 4px 30px rgba(0,0,0,0.5)' }}>
              Welcome<br />
              <span className="auth-headline-gold">Back</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)' }}>
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
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Password"
                  className={`auth-input ${errors.password ? 'has-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <label htmlFor="password" className="auth-floating-label">Password</label>
                <Lock className="auth-input-icon" />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span className="mx-4 text-secondary text-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)', color: 'rgba(255,255,255,0.9)' }}>OR</span>
            <div className="flex-1 border-t border-border" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className="w-full flex items-center justify-center gap-3 bg-surface border border-border text-primary py-3 px-4 rounded-xl hover:bg-surface-light transition-colors duration-300"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              marginBottom: '24px',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              color: '#FFFFFF'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
