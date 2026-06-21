import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthImage from '@/components/ui/AuthImage';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '@/redux/slices/authSlice';
import Alert from '@/components/ui/Alert';


export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const { name, email, phone, password } = data;
    const result = await dispatch(registerAction({ name, email, phone, password, role: 'user' }));
    
    if (registerAction.fulfilled.match(result)) {
      const userRole = result.payload?.user?.role;
      const redirectPath = userRole === 'admin' ? '/admin/dashboard'
        : userRole === 'vendor' ? '/vendor/dashboard'
        : '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(result.payload || 'Failed to create account');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      {...pageTransition} 
      className="auth-page"
      style={{
        '--auth-theme-hex': '#D4AF37',
        '--auth-theme-hex-light': '#E8D090',
        '--auth-theme-rgb': '212, 175, 55'
      }}
    >
      <div className="auth-left-panel hidden md:flex">
        <AuthImage
          src="https://www.hdcarwallpapers.com/walls/2021_rolls_royce_phantom_extended_5k_2-HD.jpg"
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
              Begin Your<br />
              <span className="auth-headline-gold">Journey</span>
            </h1>
            <p className="auth-subheadline" style={{ fontSize: '1.15rem', maxWidth: '480px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)' }}>
              Join an exclusive community of luxury enthusiasts. Experience unparalleled service and extraordinary vehicles.
            </p>
          </motion.div>
          <div />
        </div>
      </div>

      <div className="auth-right-panel" style={{ padding: '40px 0' }}>
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE_LUXE }}
          style={{ padding: '32px 48px' }}
        >
          <Link to="/" className="auth-mobile-logo">
            <Car className="auth-logo-icon" />
            <span className="auth-logo-text">Luxoria</span>
          </Link>

          <div className="auth-card-header" style={{ marginBottom: '24px' }}>
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-subtitle">Complete your details to join Luxoria.</p>
          </div>

          {errorMsg && (
            <Alert type="error" className="mb-6">{errorMsg}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className={`auth-input ${errors.name ? 'has-error' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                <label htmlFor="name" className="auth-floating-label">Full Name</label>
                <User className="auth-input-icon" />
              </div>
              {errors.name && <div className="auth-input-error"><span>{errors.name.message}</span></div>}
            </div>

            {/* Email */}
            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' },
                  })}
                />
                <label htmlFor="email" className="auth-floating-label">Email Address</label>
                <Mail className="auth-input-icon" />
              </div>
              {errors.email && <div className="auth-input-error"><span>{errors.email.message}</span></div>}
            </div>

            {/* Phone */}
            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="phone"
                  placeholder="Phone Number"
                  className={`auth-input ${errors.phone ? 'has-error' : ''}`}
                  {...register('phone', { required: 'Phone number is required' })}
                />
                <label htmlFor="phone" className="auth-floating-label">Phone Number</label>
                <Phone className="auth-input-icon" />
              </div>
              {errors.phone && <div className="auth-input-error"><span>{errors.phone.message}</span></div>}
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
                    minLength: { value: 6, message: 'Minimum 6 characters' }
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


            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Create Account <ArrowRight className="w-5 h-5 ml-2" /></>}
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
            Sign up with Google
          </button>

          <p className="auth-switch" style={{ marginTop: '24px' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
