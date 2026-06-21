import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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

      try {
        // Step 1: The backend set an HTTP-only refresh token cookie after Google OAuth.
        // Call /auth/refresh to exchange the refresh cookie for an access token.
        const refreshRes = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const accessToken = refreshRes.data.data.accessToken;

        // Step 2: Use the access token to fetch the user profile
        const profileRes = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        const user = profileRes.data.data.user;

        // Step 3: Set credentials in Redux
        dispatch(setCredentials({ user, accessToken }));

        // Step 4: Redirect based on role
        const role = user.role;
        navigate(
          role === 'admin'
            ? '/admin/dashboard'
            : role === 'vendor'
              ? '/vendor/dashboard'
              : '/dashboard',
          { replace: true }
        );
      } catch (err) {
        console.error('OAuth callback error:', err);
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
