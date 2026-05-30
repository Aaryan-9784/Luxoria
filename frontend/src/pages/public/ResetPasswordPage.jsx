import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/redux/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await dispatch(resetPassword({ token, password: data.password }));
    
    if (resetPassword.fulfilled.match(result)) {
      setSuccess(true);
    } else {
      setErrorMsg(result.payload || 'Invalid or expired token.');
    }
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="glass-card p-8 md:p-10 w-full max-w-[420px] relative z-10">
        {!success ? (
          <>
            <h1 className="text-h3 text-primary mb-2 text-center">Set New Password</h1>
            <p className="text-body-sm text-secondary text-center mb-8">
              Please enter your new password below.
            </p>

            {errorMsg && <Alert type="error" className="mb-6">{errorMsg}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Must contain uppercase, lowercase, number and special char',
                  }
                })}
              />

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: (val) => val === newPassword || 'Passwords do not match'
                })}
              />

              <Button type="submit" loading={loading} className="w-full mt-2" size="lg" iconRight={ArrowRight}>
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-h4 text-primary mb-3">Password Reset!</h2>
            <p className="text-body-sm text-secondary mb-8">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full" size="lg">
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
