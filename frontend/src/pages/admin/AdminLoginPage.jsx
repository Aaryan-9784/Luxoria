import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthImage from '@/components/ui/AuthImage';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { adminLogin } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';


export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(adminLogin(data));
    
    if (adminLogin.fulfilled.match(result)) {
      navigate('/admin/dashboard', { replace: true });
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
        '--auth-theme-hex': '#8B0000',
        '--auth-theme-hex-light': '#B22222',
        '--auth-theme-rgb': '139, 0, 0'
      }}
    >

      {/* LEFT PANEL */}
      <div className="auth-left-panel hidden md:flex">
        <AuthImage
          src="https://images.alphacoders.com/127/1271987.jpg"
          alt="Luxurious sports car"
          style={{ filter: 'grayscale(30%) contrast(1.2)' }}
        />

        <div className="auth-overlay-gold" style={{ background: 'linear-gradient(135deg, rgba(139,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)' }} />
        <div className="auth-overlay-vignette" />
        <div className="auth-ambient-light" style={{ background: 'radial-gradient(circle at center, rgba(178,34,34,0.15) 0%, transparent 70%)' }} />

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
              Luxoria<br />
              <span className="auth-headline-gold" style={{ color: '#ff4d4d', backgroundImage: 'none', WebkitTextFillColor: 'initial' }}>Admin</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)' }}>
              Secure portal for administrators to manage operations, users, and platform settings.
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
            <span className="auth-logo-text">Luxoria Admin</span>
          </Link>

          <div className="auth-card-header">
            <h2 className="auth-card-title">Admin Portal</h2>
            <p className="auth-card-subtitle">
              Enter your secure credentials to continue.
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
              <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#ff4d4d', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ background: '#8B0000', color: 'white' }}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Secure Login
                  <ArrowRight className="w-5 h-5" style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Not an admin?{' '}
            <Link to="/login" style={{ color: '#ff4d4d' }}>User Login</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
