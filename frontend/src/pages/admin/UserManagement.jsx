import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserStatus } from '@/redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Ban, CheckCircle, MoreVertical, Download, Filter, ChevronLeft, ChevronRight, UserX, UserCheck } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'suspended'
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchUsers('?role=user'));
  }, [dispatch, accessToken]);

  // Filtering
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? u.isActive : !u.isActive;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const toggleStatus = async (id, currentStatus) => {
    await dispatch(updateUserStatus({ id, isActive: !currentStatus }));
  };

  const handleExport = () => {
    const csvRows = ["Name,Email,Phone,Joined,Status"];
    filteredUsers.forEach(u => {
      const name = `"${u.name.replace(/"/g, '""')}"`;
      const email = `"${u.email.replace(/"/g, '""')}"`;
      const phone = `"${(u.phone || 'N/A').replace(/"/g, '""')}"`;
      const joined = `"${new Date(u.createdAt).toLocaleDateString()}"`;
      const status = u.isActive ? 'Active' : 'Suspended';
      csvRows.push(`${name},${email},${phone},${joined},${status}`);
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "luxoria_users.csv");
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
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">User Management</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Managing {totalUsers} registered enterprise customers.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors"
            />
          </div>

          {/* Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={(val) => {setFilterStatus(val); setCurrentPage(1);}}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' }
            ]}
          />

          {/* Export */}
          <button onClick={handleExport} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors shadow-lg shadow-[#0F0F0F]/10">
            <Download className="w-4 h-4 text-[#C9A75D]" /> Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Syncing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Joined</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A75D] to-[#E8D090] p-[2px] shrink-0">
                          <div className="w-full h-full rounded-full border border-white bg-white flex items-center justify-center relative overflow-hidden">
                            <span className="font-bold text-[#0F0F0F] text-sm">{user.name.charAt(0)}</span>
                            {user.avatar?.url && (
                              <img 
                                src={user.avatar.url} 
                                alt="avatar" 
                                className="w-full h-full object-cover absolute top-0 left-0 bg-white"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{user.name}</p>
                          <p className="text-[11px] text-[#666666] uppercase tracking-wider mt-0.5 whitespace-nowrap">ID: {user._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] text-[#0F0F0F] font-medium whitespace-nowrap">{user.email}</p>
                      <p className="text-[11px] text-[#666666] mt-0.5 whitespace-nowrap">{user.phone || 'No phone provided'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] text-[#0F0F0F] whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                    <td className="py-4 px-6">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[10px] font-bold uppercase tracking-wider text-[#16A34A] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 text-[10px] font-bold uppercase tracking-wider text-[#DC2626] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => toggleStatus(user._id, user.isActive)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          user.isActive 
                            ? 'border-[#ECECEC] text-[#DC2626] hover:bg-[#DC2626]/5 hover:border-[#DC2626]' 
                            : 'border-[#ECECEC] text-[#16A34A] hover:bg-[#16A34A]/5 hover:border-[#16A34A]'
                        }`}
                      >
                        {user.isActive ? <><UserX className="w-3.5 h-3.5" /> Suspend</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#666666]">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[13px] font-medium">No customers found matching your criteria.</p>
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
              Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
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
