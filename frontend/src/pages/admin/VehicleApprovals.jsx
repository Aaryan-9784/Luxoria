import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVehicles, approveVehicle } from '@/redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, MapPin, Search, Download, ChevronLeft, ChevronRight, Car, Check } from 'lucide-react';

export default function VehicleApprovals() {
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector(state => state.admin);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 9; // Grid of 3, so 9 is a good number

  useEffect(() => {
    dispatch(fetchAdminVehicles());
  }, [dispatch]);

  // Filtering
  const filteredVehicles = vehicles.filter(v => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (v.name && v.name.toLowerCase().includes(term)) ||
      (v.brand && v.brand.toLowerCase().includes(term)) ||
      (v.vendor?.name && v.vendor.name.toLowerCase().includes(term));
    const matchesStatus = v.status === filter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * vehiclesPerPage, currentPage * vehiclesPerPage);

  const handleApprove = async (id, status) => {
    await dispatch(approveVehicle({ id, status }));
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Brand,Model,Vendor,Location,Price Per Day,Status\n"
      + filteredVehicles.map(v => `${v.brand},${v.name},${v.vendor?.name},${v.location?.city || 'N/A'},${v.pricePerDay},${v.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `luxoria_${filter}_vehicles.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Fleet Approvals</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Review and authorize new vehicles for the platform.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Filter Tabs */}
          <div className="flex p-1 bg-white border border-[#ECECEC] rounded-xl">
            {['pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => { setFilter(status); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold capitalize tracking-wider transition-all ${
                  filter === status 
                    ? 'bg-[#0F0F0F] text-white shadow-sm' 
                    : 'text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors"
            />
          </div>

          {/* Export */}
          <button onClick={handleExport} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-[#ECECEC] text-[#0F0F0F] px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors">
            <Download className="w-4 h-4 text-[#666666]" /> Export
          </button>
        </div>
      </div>

      {loading && vehicles.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-16 flex flex-col items-center justify-center shadow-sm">
           <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Syncing Fleet Data...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-16 flex flex-col items-center justify-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-[#C9A75D]" />
          </div>
          <h3 className="text-lg font-serif text-[#0F0F0F] mb-2">No {filter} vehicles</h3>
          <p className="text-[13px] text-[#666666]">There are currently no vehicles in this queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedVehicles.map((vehicle) => (
              <motion.div key={vehicle._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-48 bg-[#F5F5F5] border-b border-[#ECECEC] overflow-hidden">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img src={vehicle.images[0].url} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#999999]">
                      <Car className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0F0F0F]/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                      ${vehicle.pricePerDay.toLocaleString('en-US')}/day
                    </span>
                  </div>
                  {vehicle.status === 'pending' && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A75D] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Pending Review
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-[10px] text-[#C9A75D] font-bold uppercase tracking-widest block mb-1">{vehicle.brand}</span>
                    <h3 className="text-lg font-bold text-[#0F0F0F] leading-tight">{vehicle.name}</h3>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-3 text-[12px] text-[#666666]">
                      <MapPin className="w-4 h-4 text-[#999999]" /> 
                      <span className="font-medium text-[#0F0F0F]">{vehicle.location?.city || 'Location N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[#666666]">
                      <ShieldCheck className="w-4 h-4 text-[#999999]" /> 
                      Vendor: <span className="font-medium text-[#0F0F0F]">{vehicle.vendor?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {vehicle.status === 'pending' && (
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-[#ECECEC]">
                      <button 
                        onClick={() => handleApprove(vehicle._id, 'rejected')}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ECECEC] text-[11px] font-bold uppercase tracking-wider text-[#DC2626] hover:bg-[#DC2626]/5 hover:border-[#DC2626] transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button 
                        onClick={() => handleApprove(vehicle._id, 'approved')}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0F0F0F] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-all shadow-lg shadow-[#0F0F0F]/10"
                      >
                        <Check className="w-3.5 h-3.5 text-[#C9A75D]" /> Approve
                      </button>
                    </div>
                  )}
                  
                  {vehicle.status === 'approved' && (
                    <div className="mt-auto pt-4 border-t border-[#ECECEC]">
                      <button 
                        onClick={() => handleApprove(vehicle._id, 'rejected')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ECECEC] text-[11px] font-bold uppercase tracking-wider text-[#666666] hover:bg-[#F5F5F5] transition-all"
                      >
                        Revoke Approval
                      </button>
                    </div>
                  )}

                  {vehicle.status === 'rejected' && (
                    <div className="mt-auto pt-4 border-t border-[#ECECEC]">
                      <button 
                        onClick={() => handleApprove(vehicle._id, 'pending')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ECECEC] text-[11px] font-bold uppercase tracking-wider text-[#666666] hover:bg-[#F5F5F5] transition-all"
                      >
                        Return to Queue
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="border border-[#ECECEC] rounded-2xl p-4 flex items-center justify-between bg-white shadow-sm">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
                Showing {(currentPage - 1) * vehiclesPerPage + 1} to {Math.min(currentPage * vehiclesPerPage, filteredVehicles.length)} of {filteredVehicles.length}
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
      )}

    </motion.div>
  );
}
