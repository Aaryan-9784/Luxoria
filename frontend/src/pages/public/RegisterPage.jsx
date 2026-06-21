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



          <p className="auth-switch" style={{ marginTop: '24px' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
