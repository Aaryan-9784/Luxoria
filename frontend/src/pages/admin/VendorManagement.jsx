import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, approveVendor, updateUserStatus } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Search, Building2, CheckCircle, XCircle, Download, Filter, ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert, UserX, UserCheck } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function VendorManagement() {
  const dispatch = useDispatch();
  const { vendors, loading, totalVendors } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchVendors());
  }, [dispatch, accessToken]);

  // Filtering
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'verified' ? v.isVerified : !v.isVerified;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * vendorsPerPage, currentPage * vendorsPerPage);

  const toggleApproval = async (id, currentVerification) => {
    await dispatch(approveVendor({ id, isVerified: !currentVerification }));
  };

  const toggleStatus = async (id, currentStatus) => {
    await dispatch(updateUserStatus({ id, isActive: !currentStatus }));
  };

  const handleExport = () => {
    const csvRows = ["Business Name,Email,Phone,Verification,Account State"];
    filteredVendors.forEach(v => {
      const name = `"${v.name.replace(/"/g, '""')}"`;
      const email = `"${v.email.replace(/"/g, '""')}"`;
      const phone = `"${(v.phone || 'N/A').replace(/"/g, '""')}"`;
      const verification = v.isVerified ? 'Verified' : 'Pending KYC';
      const status = v.isActive ? 'Active' : 'Suspended';
      csvRows.push(`${name},${email},${phone},${verification},${status}`);
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "luxoria_vendors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Vendor Partners</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Managing {totalVendors} automotive partners.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
            <input 
              type="text" 
              placeholder="Search partners..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-11 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] focus:shadow-[0_0_0_3px_rgba(201,167,93,0.1)] transition-all"
            />
          </div>

          {/* Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={(val) => {setFilterStatus(val); setCurrentPage(1);}}
            options={[
              { value: 'all', label: 'All Verification' },
              { value: 'verified', label: 'Verified' },
              { value: 'pending', label: 'Pending KYC' }
            ]}
          />

          {/* Export */}
          <button onClick={handleExport} className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10 whitespace-nowrap">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {loading && vendors.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Syncing Vendor Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Business / Partner</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Verification</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Account State</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right whitespace-nowrap">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {paginatedVendors.length > 0 ? paginatedVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A75D] to-[#E8D090] p-[2px] shrink-0">
                          <div className="w-full h-full rounded-full border border-white bg-white flex items-center justify-center relative overflow-hidden">
                            <Building2 className="w-4 h-4 text-[#C9A75D]" />
                            {vendor.avatar?.url && (
                              <img 
                                src={vendor.avatar.url} 
                                alt="avatar" 
                                className="w-full h-full object-cover absolute top-0 left-0 bg-white"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{vendor.name}</p>
                          <p className="text-[11px] text-[#666666] uppercase tracking-wider mt-0.5 whitespace-nowrap">ID: {vendor._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] text-[#0F0F0F] font-medium whitespace-nowrap">{vendor.email}</p>
                      <p className="text-[11px] text-[#666666] mt-0.5 whitespace-nowrap">{vendor.phone || 'No phone provided'}</p>
                    </td>
                    <td className="py-4 px-6">
                      {vendor.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[10px] font-bold uppercase tracking-wider text-[#16A34A] whitespace-nowrap">
                          <ShieldCheck className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 text-[10px] font-bold uppercase tracking-wider text-[#C9A75D] whitespace-nowrap">
                          <ShieldAlert className="w-3 h-3" /> Pending KYC
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {vendor.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F0F0F]/5 border border-[#0F0F0F]/10 text-[10px] font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#666666]"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 text-[10px] font-bold uppercase tracking-wider text-[#DC2626] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => toggleApproval(vendor._id, vendor.isVerified)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            vendor.isVerified 
                              ? 'border-[#ECECEC] text-[#666666] hover:bg-[#F5F5F5]' 
                              : 'border-[#C9A75D] bg-[#C9A75D] text-white hover:bg-[#B59345]'
                          }`}
                        >
                          {vendor.isVerified ? 'Revoke Approval' : 'Approve Partner'}
                        </button>
                        <button 
                          onClick={() => toggleStatus(vendor._id, vendor.isActive)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            vendor.isActive
                              ? 'text-[#666666] hover:bg-[#DC2626]/10 hover:text-[#DC2626]'
                              : 'text-[#DC2626] hover:bg-[#16A34A]/10 hover:text-[#16A34A]'
                          }`}
                          title={vendor.isActive ? "Suspend Vendor" : "Activate Vendor"}
                        >
                          {vendor.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#666666]">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[13px] font-medium">No partners found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-[#ECECEC] p-4 flex items-center justify-between bg-[#F9F9F9]">
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
              Showing {(currentPage - 1) * vendorsPerPage + 1} to {Math.min(currentPage * vendorsPerPage, filteredVendors.length)} of {filteredVendors.length}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#ECECEC] text-[#0F0F0F] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#0F0F0F] text-white' : 'text-[#666666] hover:bg-[#ECECEC]'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#ECECEC] text-[#0F0F0F] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </motion.div>
  );
}
