import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import api from '@/services/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasProcessed = React.useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuth = async () => {
      const error = searchParams.get('error');
      if (error) {
        navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
        return;
      }

      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');

      // 1. Cross-domain token exchange (recommended for Vercel + Render deployments)
      if (token) {
        try {
          if (refreshToken) {
            localStorage.setItem('luxoria_refresh_token', refreshToken);
          }
          localStorage.setItem('luxoria_has_session', 'true');

          const profileRes = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = profileRes.data.data.user;
          dispatch(setCredentials({ user, accessToken: token }));

          const role = user.role;
          const targetPath = role === 'admin'
            ? '/admin/dashboard'
            : role === 'vendor'
              ? '/vendor/dashboard'
              : '/dashboard';

          navigate(targetPath, { replace: true });
          return;
        } catch (fetchErr) {
          console.error('OAuth profile retrieval failed:', fetchErr);
          localStorage.removeItem('luxoria_has_session');
          localStorage.removeItem('luxoria_refresh_token');
          navigate('/login?error=auth_failed', { replace: true });
          return;
        }
      }

      // 2. Cookie-based fallback
      try {
        const storedRefreshToken = localStorage.getItem('luxoria_refresh_token');
        const refreshRes = await api.post('/auth/refresh', {
          refreshToken: storedRefreshToken || undefined,
        });

        const accessToken = refreshRes.data.data.accessToken;
        const newRefreshToken = refreshRes.data.data.refreshToken;
        if (newRefreshToken) {
          localStorage.setItem('luxoria_refresh_token', newRefreshToken);
        }
        localStorage.setItem('luxoria_has_session', 'true');

        const profileRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = profileRes.data.data.user;
        dispatch(setCredentials({ user, accessToken }));

        const role = user.role;
        const targetPath = role === 'admin'
          ? '/admin/dashboard'
          : role === 'vendor'
            ? '/vendor/dashboard'
            : '/dashboard';

        navigate(targetPath, { replace: true });
      } catch (cookieErr) {
        console.error('OAuth fallback failed:', cookieErr);
        localStorage.removeItem('luxoria_has_session');
        localStorage.removeItem('luxoria_refresh_token');
        navigate('/login?error=auth_failed', { replace: true });
      }
    };

    handleOAuth();
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
