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
            className="input pl-9"
          />
        </div>
      </div>

      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
        {loading && vendors.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading vendor database...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Business / Partner</th>
                  <th>Contact</th>
                  <th>Verification</th>
                  <th>Account State</th>
                  <th className="text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                          {vendor.avatar?.url ? <img src={vendor.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-accent" />}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{vendor.name}</p>
                          <p className="text-caption text-muted">ID: {vendor._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-body-sm text-primary">{vendor.email}</p>
                      <p className="text-caption text-muted">{vendor.phone || 'N/A'}</p>
                    </td>
                    <td>
                      {vendor.isVerified ? (
                        <span className="badge badge-success">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="badge badge-accent">
                          Pending KYC
                        </span>
                      )}
                    </td>
                    <td>
                      {vendor.isActive ? (
                        <span className="badge badge-muted">Active</span>
                      ) : (
                        <span className="badge badge-error">Suspended</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => toggleApproval(vendor._id, vendor.isVerified)}
                          className={`btn btn-sm ${
                            vendor.isVerified ? 'btn-outline text-secondary' : 'btn-primary'
                          }`}
                        >
                          {vendor.isVerified ? 'Revoke Approval' : 'Approve Partner'}
                        </button>
                        <button 
                          onClick={() => toggleStatus(vendor._id, vendor.isActive)}
                          className="btn-icon hover:text-error hover:border-error transition-colors"
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
