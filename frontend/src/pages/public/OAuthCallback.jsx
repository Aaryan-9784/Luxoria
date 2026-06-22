import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const handleAuth = async () => {
      const error = searchParams.get('error');

      if (error) {
        navigate('/login?error=auth_failed');
        return;
      }
      
      // We no longer manually call /auth/refresh here.
      // AppRoutes.jsx already calls /auth/refresh on initial load, which happens concurrently.
      // If we call it here too, the backend's Strict Token Rotation will detect token reuse and invalidate the session (401).
      // Let's just wait for Redux to be updated by AppRoutes.jsx!
    };

    handleAuth();
  }, [searchParams, navigate]);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      navigate(
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'vendor'
            ? '/vendor/dashboard'
            : '/dashboard',
        { replace: true }
      );
    }
  }, [isAuthenticated, user, navigate]);

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
