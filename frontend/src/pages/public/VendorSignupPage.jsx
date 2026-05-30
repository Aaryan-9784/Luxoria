import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Building2, User as UserIcon, Mail, Phone, Lock, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';
import { useDispatch } from 'react-redux';
import { register as registerUser } from '@/redux/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;

export default function VendorSignupPage() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const nextStep = async () => {
    // Validate current step fields before moving on
    let isValid = false;
    if (step === 1) isValid = await trigger(['name', 'email', 'phone']);
    if (step === 2) isValid = await trigger(['password', 'businessName']);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    // In a real app, handle file upload to Cloudinary here first
    const result = await dispatch(registerUser({ ...data, role: 'vendor' }));
    if (registerUser.fulfilled.match(result)) navigate('/vendor/dashboard');
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-surface flex flex-col pt-24 pb-12">
      <div className="container-luxe flex-1 flex flex-col items-center max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-10 w-full">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <Car className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            <span className="text-lg font-bold tracking-[0.2em] uppercase text-primary">Luxoria Partners</span>
          </Link>
          <h1 className="text-h2 text-primary mb-2">Partner with Excellence</h1>
          <p className="text-body text-secondary">Join our exclusive network of premium luxury vehicle vendors.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-500 ${
                  step >= num ? 'bg-accent text-white shadow-glow-gold' : 'bg-surface border-2 border-border text-muted'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-xl glass-card p-8 md:p-10 relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE_LUXE }}
                  className="space-y-5"
                >
                  <h3 className="text-h4 text-primary mb-4">Personal Details</h3>
                  <Input label="Owner Name" icon={UserIcon} placeholder="John Doe" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
                  <Input label="Email Address" type="email" icon={Mail} placeholder="name@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                  <Input label="Phone Number" type="tel" icon={Phone} placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone', { required: 'Phone is required' })} />
                  
                  <Button type="button" onClick={nextStep} className="w-full mt-4" size="lg" iconRight={ArrowRight}>
                    Continue
                  </Button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-caption text-muted">OR</span>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <button type="button" onClick={() => window.location.href = GOOGLE_AUTH_URL} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl hover:bg-surface/60 hover:border-accent/40 transition-all font-medium text-primary">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Register with Google
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE_LUXE }}
                  className="space-y-5"
                >
                  <h3 className="text-h4 text-primary mb-4">Business Details</h3>
                  <Input label="Business Name" icon={Building2} placeholder="Luxury Motors LLC" error={errors.businessName?.message} {...register('businessName', { required: 'Business Name is required' })} />
                  <Input label="Secure Password" type="password" icon={Lock} placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required', pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'Must contain uppercase, lowercase, number and special char' } })} />
                  
                  <div className="flex gap-3 mt-6">
                    <Button type="button" onClick={prevStep} variant="outline" className="flex-1">Back</Button>
                    <Button type="button" onClick={nextStep} className="flex-1" iconRight={ArrowRight}>Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE_LUXE }}
                  className="space-y-5"
                >
                  <h3 className="text-h4 text-primary mb-4">Verification Documents</h3>
                  <p className="text-body-sm text-secondary mb-4">Please upload your business registration and insurance certificates.</p>
                  
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-surface hover:bg-surface/60 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-body-sm font-medium text-primary">Click to upload or drag and drop</p>
                    <p className="text-caption text-muted mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button type="button" onClick={prevStep} variant="outline" className="flex-1">Back</Button>
                    <Button type="submit" loading={loading} className="flex-1" iconRight={CheckCircle2}>Submit Application</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

      </div>
    </motion.div>
  );
}
