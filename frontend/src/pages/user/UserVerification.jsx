import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UploadCloud, AlertCircle, FileText, CheckCircle2, CreditCard, Clock, Camera, Lock } from 'lucide-react';

const VERIFICATION_DOCS = [
  {
    id: 'gov_id',
    title: 'Government ID',
    description: 'Passport or National Identity Card.',
    status: 'verified',
    icon: FileText,
    lastUpdated: 'Oct 12, 2023',
    message: 'Your identity has been successfully verified.'
  },
  {
    id: 'license',
    title: 'Driver\'s License',
    description: 'Valid driving license required for self-drive rentals.',
    status: 'required',
    icon: CreditCard,
    lastUpdated: null,
    message: 'Please upload a clear scan of the front and back.'
  },
  {
    id: 'selfie',
    title: 'Biometric Verification',
    description: 'A live selfie to match against your government ID.',
    status: 'pending',
    icon: Camera,
    lastUpdated: 'Today',
    message: 'Under review by our security team. Usually takes 15 mins.'
  }
];

const getStatusStyles = (status) => {
  switch (status) {
    case 'verified':
      return {
        bg: 'bg-[#16A34A]/10',
        text: 'text-[#16A34A]',
        border: 'border-[#16A34A]/20',
        icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />,
        label: 'Verified'
      };
    case 'pending':
      return {
        bg: 'bg-[#F59E0B]/10',
        text: 'text-[#F59E0B]',
        border: 'border-[#F59E0B]/20',
        icon: <Clock className="w-4 h-4 text-[#F59E0B]" />,
        label: 'Under Review'
      };
    case 'required':
      return {
        bg: 'bg-[#DC2626]/10',
        text: 'text-[#DC2626]',
        border: 'border-[#DC2626]/20',
        icon: <AlertCircle className="w-4 h-4 text-[#DC2626]" />,
        label: 'Action Required'
      };
    default:
      return {
        bg: 'bg-[#F5F5F5]',
        text: 'text-[#999999]',
        border: 'border-[#ECECEC]',
        icon: null,
        label: 'Unknown'
      };
  }
};

export default function UserVerification() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-serif text-[#0F0F0F] tracking-tight mb-1">Identity & Verification</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Complete your verification to unlock Tier-1 luxury vehicles.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#16A34A]/5 border border-[#16A34A]/20 rounded-full">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-widest">Bank-Level Security</span>
        </div>
      </div>

      {/* Global Status Banner */}
      <div className="bg-white border border-[#F59E0B]/30 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B]"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#0F0F0F] mb-1">Verification Incomplete</h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Your profile is currently at <span className="font-bold text-[#0F0F0F]">Level 1 (Basic)</span>. To reserve vehicles worth over $100,000, please complete the remaining verification steps below.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
            <div className="h-1.5 w-full md:w-32 bg-[#F5F5F5] rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '33%' }}></div>
            </div>
            <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest mt-2 text-right">33% Complete</p>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {VERIFICATION_DOCS.map((doc, idx) => {
          const statusStyle = getStatusStyles(doc.status);
          const Icon = doc.icon;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              key={doc.id}
              className={`bg-white border ${doc.status === 'required' ? 'border-[#C9A75D]' : 'border-[#ECECEC]'} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden`}
            >
              {doc.status === 'required' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A75D]"></div>
              )}

              <div className="flex justify-between items-start mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.status === 'verified' ? 'bg-[#0F0F0F]' : 'bg-[#F5F5F5]'}`}>
                  <Icon className={`w-6 h-6 ${doc.status === 'verified' ? 'text-[#C9A75D]' : 'text-[#0F0F0F]'}`} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                  {statusStyle.icon}
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#0F0F0F] mb-1.5">{doc.title}</h3>
                <p className="text-[13px] text-[#666666] leading-relaxed mb-4">{doc.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-[#ECECEC]">
                <p className="text-[12px] text-[#0F0F0F] font-medium mb-4">
                  {doc.message}
                </p>

                {doc.status === 'required' ? (
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#C9A75D] transition-colors shadow-md group">
                    <UploadCloud className="w-4 h-4 text-[#C9A75D] group-hover:text-white transition-colors" />
                    <span className="text-[13px] font-bold">Upload Document</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#999999]">Last Updated</span>
                    <span className="text-[12px] font-bold text-[#0F0F0F]">{doc.lastUpdated}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security Info Card */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 md:p-8 relative overflow-hidden mt-8 shadow-sm">
        {/* Subtle background pattern/gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C9A75D]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FBFBFB] border border-[#ECECEC] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#C9A75D]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0F0F0F] mb-1.5">Strictly Confidential & Encrypted</h3>
              <p className="text-[13px] text-[#666666] leading-relaxed max-w-xl">
                Luxoria utilizes AES-256 military-grade encryption for all uploaded documents. Your files are automatically watermarked and are never shared with third parties or individual vendors.
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[13px] font-bold rounded-xl hover:bg-[#F5F5F5] hover:border-[#C9A75D] transition-all whitespace-nowrap">
            Read Privacy Policy
          </button>
        </div>
      </div>

    </motion.div>
  );
}
