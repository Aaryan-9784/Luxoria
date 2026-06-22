import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Camera, Shield, User } from 'lucide-react';
import api from '@/services/api';
import { updateUser } from '@/redux/slices/authSlice';

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
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
      const res = await api.put('/users/me', formData);
      dispatch(updateUser(res.data.data));
      setSuccessMsg('Profile updated successfully');
      
      // If there's a new avatar, upload it
      if (avatarFile) {
        const fileData = new FormData();
        fileData.append('file', avatarFile);
        const avatarRes = await api.put('/users/me/avatar', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        dispatch(updateUser(avatarRes.data.data));
        setSuccessMsg('Profile and avatar updated successfully');
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Update failed');
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
      setSuccessMsg('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Password update failed');
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-4xl">
      
      <div>
        <h1 className="text-h3 text-primary mb-1">Account Settings</h1>
        <p className="text-secondary">Manage your profile, preferences, and security.</p>
      </div>

      {successMsg && <div className="p-4 rounded-xl bg-success/10 text-success border border-success/20 text-sm font-medium">{successMsg}</div>}
      {errorMsg && <div className="p-4 rounded-xl bg-error/10 text-error border border-error/20 text-sm font-medium">{errorMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column: Avatar */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-2 border-border relative group overflow-hidden bg-surface mb-6">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <User className="w-12 h-12" />
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white mb-2" />
              <span className="text-white text-xs font-semibold">Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>
          <p className="text-caption text-secondary text-center max-w-[200px]">
            Allowed formats: JPEG, PNG. Max size: 2MB.
          </p>
        </div>

        {/* Right Column: Forms */}
        <div className="col-span-1 md:col-span-2 space-y-10">
          
          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate} className="glass-card-elevated p-8 rounded-3xl space-y-6">
            <h3 className="text-h4 text-primary border-b border-border pb-4 mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div>
                  <label className="label uppercase text-caption">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label uppercase text-caption">Email Address (Read Only)</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="input bg-surface/50 text-muted cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label uppercase text-caption">Phone</label>
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label uppercase text-caption">City / Address</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="input"
                    />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">Save Changes</button>
          </form>

          {/* Security Form */}
          <form onSubmit={handlePasswordUpdate} className="glass-card-elevated p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="text-h4 text-primary">Security & Password</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label uppercase text-caption">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.currentPassword} 
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="input"
                />
              </div>
              <div>
                <label className="label uppercase text-caption">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.newPassword} 
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="input"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-secondary">Update Password</button>
          </form>

        </div>
      </div>

    </motion.div>
  );
}
