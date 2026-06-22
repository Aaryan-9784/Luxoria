import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVehicles, approveVehicle } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, Clock, MapPin, Search } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function VehicleApprovals() {
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector(state => state.admin);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected'

  useEffect(() => {
    dispatch(fetchAdminVehicles()); // Fetch all for admin
  }, [dispatch]);

  const filteredVehicles = vehicles.filter(v => v.status === filter);

  const handleApprove = async (id, status) => {
    await dispatch(approveVehicle({ id, status }));
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-h3 text-primary mb-1">Fleet Approvals</h1>
          <p className="text-secondary text-sm">Review and authorize new vehicles for the platform.</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-surface p-1 rounded-xl border border-border">
          {['pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                filter === status ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading && vehicles.length === 0 ? (
        <div className="p-10 text-center animate-pulse text-muted">Loading fleet data...</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border shadow-sm">
          <ShieldCheck className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">No {filter} vehicles</h3>
          <p className="text-secondary text-sm">There are currently no vehicles in this queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <motion.div variants={staggerItem} key={vehicle._id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col relative group">
              
              <div className="relative h-48 bg-surface">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img src={vehicle.images[0].url} alt={vehicle.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">No Image Uploaded</div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-primary text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                    ${vehicle.pricePerDay.toLocaleString('en-US')}/day
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">{vehicle.brand}</span>
                    <h3 className="text-lg font-bold text-primary leading-tight">{vehicle.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <MapPin className="w-4 h-4 text-muted" /> {vehicle.location?.city || 'Location N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <span className="font-semibold text-primary">Vendor:</span> {vehicle.vendor?.name || 'Unknown'}
                  </div>
                </div>

                {/* Actions */}
                {vehicle.status === 'pending' && (
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border">
                    <button 
                      onClick={() => handleApprove(vehicle._id, 'rejected')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-error/30 text-error font-semibold text-sm hover:bg-error/10 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(vehicle._id, 'approved')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      <ShieldCheck className="w-4 h-4" /> Approve
                    </button>
                  </div>
                )}
                
                {vehicle.status === 'approved' && (
                  <div className="mt-auto pt-4 border-t border-border">
                    <button 
                      onClick={() => handleApprove(vehicle._id, 'rejected')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-error/30 text-error font-semibold text-sm hover:bg-error/10 transition-colors"
                    >
                      Revoke Approval
                    </button>
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
