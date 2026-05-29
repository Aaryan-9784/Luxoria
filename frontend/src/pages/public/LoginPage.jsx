import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '@/redux/slices/authSlice';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const authError = searchParams.get('error') === 'auth_failed' ? 'Google Authentication failed. Please try again.' : null;

  React.useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen flex bg-background">
      
      {/* ── Left Side: Cinematic Visual ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-primary">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'linear' }}
          src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury car interior"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          <Link to="/" className="flex items-center gap-3 text-white group w-fit">
            <Car className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold tracking-[0.2em] uppercase">Luxoria</span>
          </Link>

          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE_LUXE }}
              className="text-display text-white leading-[1.1] mb-6"
            >
              Enter the <br />
              <span className="text-gradient-gold">Extraordinary</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: EASE_LUXE }}
              className="text-lg text-white/70 font-light"
            >
              Sign in to access your bookings, manage your wishlist, and unlock exclusive luxury vehicle experiences.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle mobile background blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent rounded-full blur-[150px] opacity-[0.03] lg:hidden" />

        <div className="w-full max-w-[420px] z-10">
          <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-12">
            <Car className="w-7 h-7 text-accent" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-primary">Luxoria</span>
          </Link>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-h3 text-primary mb-2">Welcome Back</h2>
            <p className="text-body-sm text-secondary">Sign in to continue your journey.</p>
          </div>

          {(error || authError) && <Alert type="error" className="mb-6">{error || authError}</Alert>}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-surface border border-border rounded-xl hover:bg-surface/60 hover:border-accent/40 transition-all shadow-sm font-medium text-primary mb-6 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-caption text-muted">OR CONTINUE WITH EMAIL</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="label mb-0">Password</span>
                <Link to="/forgot-password" className="text-caption font-medium text-accent hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg" iconRight={ArrowRight}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-body-sm text-secondary mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-accent transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
