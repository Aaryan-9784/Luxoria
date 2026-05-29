import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, approveVendor, updateUserStatus } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Search, Building2, CheckCircle, XCircle } from 'lucide-react';

export default function VendorManagement() {
  const dispatch = useDispatch();
  const { vendors, loading, totalVendors } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleApproval = async (id, currentVerification) => {
    await dispatch(approveVendor({ id, isVerified: !currentVerification }));
  };

  const toggleStatus = async (id, currentStatus) => {
    await dispatch(updateUserStatus({ id, isActive: !currentStatus }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">Vendor Partners</h1>
          <p className="text-secondary text-sm">Managing {totalVendors} automotive partners.</p>
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search partners..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-body-sm outline-none focus:border-accent shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading && vendors.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading vendor database...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Business / Partner</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Account State</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                          {vendor.avatar?.url ? <img src={vendor.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-accent" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{vendor.name}</p>
                          <p className="text-xs text-muted">ID: {vendor._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-primary">{vendor.email}</p>
                      <p className="text-xs text-muted">{vendor.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-success/10 text-success border border-success/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          Pending KYC
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {vendor.isActive ? (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-surface text-secondary border border-border">Active</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-error/10 text-error">Suspended</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => toggleApproval(vendor._id, vendor.isVerified)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors border ${
                            vendor.isVerified ? 'border-border text-secondary hover:bg-surface' : 'bg-primary text-white hover:bg-primary/90'
                          }`}
                        >
                          {vendor.isVerified ? 'Revoke Approval' : 'Approve Partner'}
                        </button>
                        <button 
                          onClick={() => toggleStatus(vendor._id, vendor.isActive)}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                          title={vendor.isActive ? "Suspend Vendor" : "Activate Vendor"}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
