import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles } from '@/redux/slices/vendorSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Edit2, Trash2, CheckCircle2, Clock, AlertCircle, Car } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function ManageFleet() {
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector(state => state.vendor);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVendorVehicles());
  }, [dispatch]);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'pending': return <span className="bg-[#C9A75D]/10 text-[#B59345] border border-[#C9A75D]/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'rejected': return <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md"><AlertCircle className="w-3 h-3" /> Rejected</span>;
      default: return null;
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-bold uppercase tracking-widest text-[11px] animate-pulse">Loading Fleet Data</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Fleet Management</h1>
          <p className="text-[#666666] text-[13px] font-medium tracking-wide">Manage your vehicles, pricing, and availability.</p>
        </div>
        <Link to="/vendor/add-vehicle" className="flex items-center gap-2 px-6 py-3.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all shrink-0">
          <PlusCircle className="w-4 h-4" /> Add Vehicle
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input 
            type="text" 
            placeholder="Search fleet by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF] shadow-sm"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-16 text-center shadow-sm">
          <Car className="w-12 h-12 text-[#ECECEC] mx-auto mb-4" />
          <h3 className="text-[18px] font-bold text-[#0F0F0F] tracking-tight mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>No Vehicles Found</h3>
          <p className="text-[#666666] text-[13px] font-medium mb-6">
            {searchTerm ? "No vehicles match your search criteria." : "You haven't added any vehicles to your fleet yet."}
          </p>
          {!searchTerm && (
            <Link to="/vendor/add-vehicle" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all">
              Add Your First Vehicle
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <motion.div variants={staggerItem} key={vehicle._id} className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group flex flex-col">
              
              {/* Image & Status */}
              <div className="relative h-[240px] bg-[#F5F5F5] border-b border-[#ECECEC] overflow-hidden">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img src={vehicle.images[0].url} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                    <Car className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 left-4 z-10">
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-col gap-2">
                    <button className="w-8 h-8 bg-white text-[#0F0F0F] rounded-full flex items-center justify-center hover:text-[#C9A75D] shadow-lg transition-colors" title="Edit Vehicle">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 bg-white text-[#0F0F0F] rounded-full flex items-center justify-center hover:text-[#DC2626] shadow-lg transition-colors" title="Delete Vehicle">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C9A75D] mb-1.5 block">{vehicle.brand}</span>
                      <h3 className="text-[18px] font-bold text-[#0F0F0F] tracking-tight leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{vehicle.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-bold text-[#0F0F0F] leading-tight">${vehicle.pricePerDay?.toLocaleString('en-US')}</p>
                      <p className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">Per Day</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#ECECEC] pt-4">
                    <div>
                      <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Category</p>
                      <p className="text-[12px] font-bold text-[#0F0F0F] capitalize">{vehicle.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Location</p>
                      <p className="text-[12px] font-bold text-[#0F0F0F] truncate">{vehicle.location?.city || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {vehicle.status === 'rejected' && (
                  <div className="mt-5 p-3 bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-[#DC2626] leading-snug">Please review admin feedback and update vehicle details.</p>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
