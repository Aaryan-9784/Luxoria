import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ShieldCheck, KeyRound, User as UserIcon, ArrowRight, Eye, EyeOff, Link as LinkIcon, Upload, X, ZoomIn, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { updateUser } from '@/redux/slices/authSlice';

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active section from URL hash: #security → 'security', else 'profile'
  const sectionFromHash = location.hash === '#security' ? 'security' : 'profile';
  const [activeSection, setActiveSection] = useState(sectionFromHash);

  // Keep activeSection in sync if user manually edits the URL hash
  useEffect(() => {
    setActiveSection(sectionFromHash);
  }, [sectionFromHash]);

  const handleSectionChange = (section) => {
    navigate(section === 'security' ? '#security' : '#profile', { replace: true });
    setActiveSection(section);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Sync formData whenever user loads / changes (fixes post-refresh empty fields)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address?.city || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarMode, setAvatarMode] = useState('upload'); // 'upload' | 'url'
  const [avatarUrl, setAvatarUrl] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [urlSaving, setUrlSaving] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);

  // Keep preview in sync with Redux (e.g. after delete from another tab or re-login)
  useEffect(() => {
    if (!avatarFile && !avatarUrl) {
      setAvatarPreview(user?.avatar?.url || '');
    }
  }, [user?.avatar?.url]);

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
          city: formData.address,
        },
      };
      const res = await api.put('/users/me', payload);
      dispatch(updateUser(res.data.data));
      setSuccessMsg('Personal details updated successfully.');

      if (avatarFile) {
        const fileData = new FormData();
        fileData.append('file', avatarFile);
        const avatarRes = await api.put('/users/me/avatar', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(updateUser(avatarRes.data.data));
        setSuccessMsg('Profile and photo updated successfully.');
      }

      if (avatarMode === 'url' && avatarUrl.trim()) {
        const avatarRes = await api.put('/users/me/avatar-url', { url: avatarUrl.trim() });
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
    setErrorMsg(''); setSuccessMsg('');

    if (passwordData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessMsg('Security credentials updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setShowPasswords({ currentPassword: false, newPassword: false });
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

  const onAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    if (url.trim()) setAvatarPreview(url.trim());
    else setAvatarPreview(user?.avatar?.url || '');
  };

  const handleSaveAvatarUrl = async () => {
    if (!avatarUrl.trim()) return;
    setUrlSaving(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      const avatarRes = await api.put('/users/me/avatar-url', { url: avatarUrl.trim() });
      dispatch(updateUser(avatarRes.data.data));
      setAvatarPreview(avatarUrl.trim());
      setSuccessMsg('Profile photo updated successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to update photo.');
      setAvatarPreview(user?.avatar?.url || '');
    } finally {
      setUrlSaving(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarDeleting(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      const res = await api.delete('/users/me/avatar');
      dispatch(updateUser(res.data.data));
      setAvatarPreview('');
      setAvatarFile(null);
      setAvatarUrl('');
      setLightboxOpen(false);
      setSuccessMsg('Profile photo removed.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to remove photo.');
    } finally {
      setAvatarDeleting(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-white pb-24">

      {/* Ultra-Luxury Hero Section */}
      <div className="relative w-full h-48 bg-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden border-b border-[#ECECEC]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9A75D]/10 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A75D]/5 via-transparent to-transparent opacity-50" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center mt-6">
          <h1 className="text-3xl md:text-4xl font-serif text-[#0F0F0F] tracking-tight mb-3">My Account</h1>
          <p className="text-[10px] md:text-[11px] text-[#666666] uppercase tracking-[0.3em] font-medium">Manage your personal dossier</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">

        {/* ── Avatar Card ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-10">

          {/* Gold ring + avatar circle */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            {/* Outer gold gradient ring */}
            <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-[#C9A75D] via-[#E8D090] to-[#C9A75D] shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#F5F5F5] relative group">

                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview(user?.avatar?.url || '')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A]">
                    <span className="text-4xl font-bold text-[#C9A75D] leading-none select-none tracking-tight">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-12 h-12 text-[#C9A75D] stroke-[1.2]" />}
                    </span>
                  </div>
                )}

                {/* Upload hover overlay */}
                {avatarMode === 'upload' && (
                  <div className="absolute inset-0 bg-[#0F0F0F]/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <Camera className="w-7 h-7 text-[#C9A75D]" />
                    <span className="text-[9px] text-white uppercase tracking-[0.2em] font-bold">Change Photo</span>
                  </div>
                )}

                {/* View hover overlay (URL mode) */}
                {avatarMode === 'url' && avatarPreview && (
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="absolute inset-0 bg-[#0F0F0F]/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <ZoomIn className="w-7 h-7 text-[#C9A75D]" />
                    <span className="text-[9px] text-white uppercase tracking-[0.2em] font-bold">View Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* File input (upload mode) */}
            {avatarMode === 'upload' && (
              <input
                type="file"
                accept="image/*"
                title=""
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 rounded-full"
                onChange={onAvatarChange}
              />
            )}

            {/* Zoom badge (upload mode, photo present) */}
            {avatarMode === 'upload' && avatarPreview && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                className="absolute bottom-1 left-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-[#FDFBF7] border border-[#ECECEC] transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#666666]" />
              </button>
            )}

            {/* Delete badge (whenever photo present) */}
            {avatarPreview && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDeleteAvatar(); }}
                disabled={avatarDeleting}
                className="absolute bottom-1 right-1 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
              >
                {avatarDeleting
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  : <Trash2 className="w-3.5 h-3.5 text-white" />
                }
              </button>
            )}
          </motion.div>

          {/* Upload method card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-xs bg-[#FDFBF7] border border-[#ECECEC] rounded-2xl p-4 mb-6 shadow-sm"
          >
            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-white border border-[#ECECEC] rounded-xl p-1 mb-3 shadow-inner">
              <button
                type="button"
                onClick={() => { setAvatarMode('upload'); setAvatarUrl(''); setAvatarPreview(user?.avatar?.url || ''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  avatarMode === 'upload'
                    ? 'bg-[#0F0F0F] text-white shadow-md'
                    : 'text-[#999999] hover:text-[#666666]'
                }`}
              >
                <Upload className="w-3 h-3" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => { setAvatarMode('url'); setAvatarFile(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  avatarMode === 'url'
                    ? 'bg-[#0F0F0F] text-white shadow-md'
                    : 'text-[#999999] hover:text-[#666666]'
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Paste URL
              </button>
            </div>

            {/* Upload mode hint */}
            {avatarMode === 'upload' && (
              <motion.p
                key="upload-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[10px] text-[#999999] uppercase tracking-widest"
              >
                Click the photo above to select a file
              </motion.p>
            )}

            {/* URL mode input + save */}
            {avatarMode === 'url' && (
              <motion.div
                key="url-input"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9A75D]" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={onAvatarUrlChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveAvatarUrl()}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#ECECEC] rounded-xl text-[11px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] bg-white transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveAvatarUrl}
                  disabled={!avatarUrl.trim() || urlSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#C9A75D] to-[#A8843A] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  {urlSaving
                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    : <Check className="w-3.5 h-3.5" />
                  }
                  {urlSaving ? 'Saving...' : 'Save Photo'}
                </button>
              </motion.div>
            )}
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
            onClick={() => handleSectionChange('profile')}
            className={`pb-4 text-[12px] uppercase tracking-widest font-bold transition-all relative ${activeSection === 'profile' ? 'text-[#0F0F0F]' : 'text-[#999999] hover:text-[#666666]'}`}
          >
            Personal Details
            {activeSection === 'profile' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F0F0F]" />
            )}
          </button>
          <button
            onClick={() => handleSectionChange('security')}
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
                    {loading ? 'Updating...' : 'Update Profile'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </motion.form>
            )}

            {/* Security Form */}
            {activeSection === 'security' && (
              <motion.form key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePasswordUpdate} className="space-y-10">

                <div className="space-y-8">

                  {/* Current Password */}
                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.currentPassword ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full bg-transparent border-b border-[#ECECEC] py-3 pr-10 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                        className="absolute right-0 bottom-3 text-[#999999] hover:text-[#0F0F0F] transition-colors"
                        tabIndex={-1}
                      >
                        {showPasswords.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="relative group">
                    <label className="block text-[10px] text-[#999999] uppercase tracking-widest font-bold mb-2 transition-colors group-focus-within:text-[#C9A75D]">New Secure Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.newPassword ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full bg-transparent border-b border-[#ECECEC] py-3 pr-10 text-[16px] text-[#0F0F0F] placeholder-[#CCCCCC] focus:outline-none focus:border-[#C9A75D] transition-colors rounded-none"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                        className="absolute right-0 bottom-3 text-[#999999] hover:text-[#0F0F0F] transition-colors"
                        tabIndex={-1}
                      >
                        {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="pt-8 flex justify-center">
                  <button type="submit" disabled={loading} className="group relative inline-flex items-center justify-center gap-3 bg-white border border-[#0F0F0F] text-[#0F0F0F] px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#0F0F0F] hover:text-white transition-colors duration-300 rounded-none disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? 'Updating...' : 'Change Password'}
                    <KeyRound className="w-4 h-4" />
                  </button>
                </div>

              </motion.form>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>

      {/* Lightbox — full-screen image viewer */}
      <AnimatePresence>
        {lightboxOpen && avatarPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full"
            >
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-auto rounded-2xl shadow-2xl object-contain max-h-[80vh]"
                onError={() => setLightboxOpen(false)}
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#F5F5F5] transition-colors"
              >
                <X className="w-4 h-4 text-[#0F0F0F]" />
              </button>

              {/* Delete from lightbox */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  disabled={avatarDeleting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
                >
                  {avatarDeleting
                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />
                  }
                  Remove Photo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
