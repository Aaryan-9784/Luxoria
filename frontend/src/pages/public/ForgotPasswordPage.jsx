import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Car, Mail, ArrowLeft, Send } from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/redux/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(forgotPassword(data.email));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess(true);
    } else {
      setErrorMsg(result.payload || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent rounded-full blur-[200px] opacity-[0.05]" />

      <Link to="/" className="flex items-center gap-2 mb-10 group relative z-10">
        <Car className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
        <span className="text-xl font-bold tracking-[0.2em] uppercase text-primary">Luxoria</span>
      </Link>

      <div className="glass-card p-8 md:p-10 w-full max-w-[420px] relative z-10">
        {!success ? (
          <>
            <h1 className="text-h3 text-primary mb-2 text-center">Reset Password</h1>
            <p className="text-body-sm text-secondary text-center mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {errorMsg && <Alert type="error" className="mb-6">{errorMsg}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email', { required: 'Email is required' })}
              />

              <Button type="submit" loading={loading} className="w-full" size="lg" iconRight={Send}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-h4 text-primary mb-3">Check your email</h2>
            <p className="text-body-sm text-secondary mb-8">
              We've sent a password reset link to your email address. Please check your inbox and spam folder.
            </p>
          </div>
        )}

        <div className="mt-8 text-center border-t border-border pt-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
