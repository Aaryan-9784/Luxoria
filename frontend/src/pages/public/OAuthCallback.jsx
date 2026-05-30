import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, fetchProfile } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import api from '@/services/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuth = async () => {
      const error = searchParams.get('error');

      if (error) {
        navigate('/login?error=auth_failed');
        return;
      }

      // We no longer rely on a token in the URL.
      // The backend has set an HTTP-only refresh token cookie.
      // fetchProfile will trigger a 401, which will be caught by the api interceptor.
      // The interceptor will then call /auth/refresh, get a new access token,
      // store it in Redux, and retry the profile fetch seamlessly.
      try {
        const result = await dispatch(fetchProfile()).unwrap();
        
        // Redirect based on role
        const role = result.user.role;
        navigate(role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
      } catch (err) {
        navigate('/login?error=auth_failed');
      }
    };

    handleAuth();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center shadow-glow-gold mb-8"
      >
        <Car className="w-8 h-8 text-accent" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-h4 text-primary font-medium tracking-wide uppercase"
      >
        Authenticating<span className="animate-pulse">...</span>
      </motion.p>
      <p className="text-body-sm text-secondary mt-2">Securing your session</p>
    </div>
  );
}
