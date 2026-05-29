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
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        navigate('/login?error=auth_failed');
        return;
      }

      if (token) {
        // Temporarily set the token in api instance to fetch profile
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          const result = await dispatch(fetchProfile()).unwrap();
          
          dispatch(setCredentials({
            user: result.user,
            accessToken: token
          }));

          // Redirect based on role
          const role = result.user.role;
          navigate(role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
        } catch (err) {
          navigate('/login?error=fetch_failed');
        }
      } else {
        navigate('/login');
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
