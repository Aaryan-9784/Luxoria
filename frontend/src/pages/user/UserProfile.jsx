import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ShieldCheck, KeyRound, User as UserIcon, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import { updateUser } from '@/redux/slices/authSlice';

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [activeSection, setActiveSection] = useState('profile'); // profile, security

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.city || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          ...user?.address,
          city: formData.address
        }
      };
      const res = await api.put('/users/me', payload);
      dispatch(updateUser(res.data.data));
      setSuccessMsg('Personal details updated successfully.');
      
      if (avatarFile) {
        const fileData = new FormData();
        fileData.append('file', avatarFile);
        const avatarRes = await api.put('/users/me/avatar', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        dispatch(updateUser(avatarRes.data.data));
        setSuccessMsg('Profile and photo updated successfully.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      await api.put('/users/me/password', passwordData);
      setSuccessMsg('Security credentials updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to update credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* Ultra-Luxury Hero Section */}
      <div className="relative w-full h-48 bg-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden border-b border-[#ECECEC]">
        {/* Abstract elegant background elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9A75D]/10 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A75D]/5 via-transparent to-transparent opacity-50" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center mt-6">
          <h1 className="text-3xl md:text-4xl font-serif text-[#0F0F0F] tracking-tight mb-3">My Account</h1>
          <p className="text-[10px] md:text-[11px] text-[#666666] uppercase tracking-[0.3em] font-medium">Manage your personal dossier</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* Avatar Centerpiece */}
        <div className="flex flex-col items-center mb-10">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group cursor-pointer mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden relative z-10">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center text-[#999999]">
                  <UserIcon className="w-12 h-12 stroke-[1.5]" />
                </div>
              )}
              {/* Hover state */}
              <div className="absolute inset-0 bg-[#0F0F0F]/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 text-white mb-2" />
                <span className="text-[9px] text-white uppercase tracking-widest font-bold">Upload Photo</span>
              </div>
            </div>
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={onAvatarChange} />
          </motion.div>

          <h2 className="text-lg font-serif text-[#0F0F0F] mb-1">{user?.name || 'Valued Client'}</h2>
          <p className="text-[11px] font-bold text-[#0F0F0F] tracking-widest uppercase mb-1.5">
            {user?.role === 'vendor' ? 'Partner Company' : user?.role === 'admin' ? 'CEO & Founder' : 'Valued Client'}
          </p>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#C9A75D]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
          </span>
        </div>

        {/* System Messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto mb-8 bg-[#16A34A]/5 border border-[#16A34A]/20 py-4 px-6 rounded-none flex items-center justify-center gap-3">
              <Check className="w-4 h-4 text-[#16A34A]" />
              <span className="text-[12px] text-[#16A34A] uppercase tracking-wider font-bold">{successMsg}</span>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto mb-8 bg-[#DC2626]/5 border border-[#DC2626]/20 py-4 px-6 rounded-none flex items-center justify-center gap-3">
              <span className="text-[12px] text-[#DC2626] uppercase tracking-wider font-bold">{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Navigation */}
        <div className="flex items-center justify-center gap-8 md:gap-16 border-b border-[#ECECEC] mb-16">
          <button 
            onClick={() => setActiveSection('profile')}
            className={`pb-4 text-[12px] uppercase tracking-widest font-bold transition-all relative ${activeSection === 'profile' ? 'text-[#0F0F0F]' : 'text-[#999999] hover:text-[#666666]'}`}
          >
            Personal Details
            {activeSection === 'profile' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F0F0F]" />
            )}
          </button>
          <button 
            onClick={() => setActiveSection('security')}
            className={`pb-4 text-[12px] uppercase tracking-widest font-bold transition-all relative ${activeSection === 'security' ? 'text-[#0F0F0F]' : 'text-[#999999] hover:text-[#666666]'}`}
          >
            Security & Access
            {activeSection === 'security' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F0F0F]" />
            )}
          </button>
        </div>

        {/* Main Forms Section - Center Constrained */}
        <div className="max-w-2xl mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* Personal Details Form */}
            {activeSection === 'profile' && (
              <motion.form key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleProfileUpdate} className="space-y-10">
                
                <div className="space-y-8">
                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2">Registered Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#999999] cursor-not-allowed rounded-none"
                    />
                    <span className="absolute right-0 bottom-3 text-[10px] font-bold text-[#16A34A] uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">Contact Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">Primary City / Address</label>
                      <input 
                        type="text" 
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-center">
                  <button type="submit" disabled={loading} className="group relative inline-flex items-center justify-center gap-3 bg-[#0F0F0F] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#C9A75D] transition-colors duration-300 rounded-none disabled:opacity-70 disabled:cursor-not-allowed">
                    Update Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </motion.form>
            )}

            {/* Security Form */}
            {activeSection === 'security' && (
              <motion.form key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePasswordUpdate} className="space-y-10">
                
                <div className="space-y-8">
                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.currentPassword} 
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">New Secure Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-transparent border-b border-[#ECECEC] py-3 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-center">
                  <button type="submit" disabled={loading} className="group relative inline-flex items-center justify-center gap-3 bg-white border border-[#0F0F0F] text-[#0F0F0F] px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#0F0F0F] hover:text-white transition-colors duration-300 rounded-none disabled:opacity-70 disabled:cursor-not-allowed">
                    Change Password
                    <KeyRound className="w-4 h-4" />
                  </button>
                </div>

              </motion.form>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
