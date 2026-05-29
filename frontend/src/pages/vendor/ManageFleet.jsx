import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles } from '@/redux/slices/vendorSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Search, MoreVertical, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import EmptyState from '@/components/ui/EmptyState';

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
      case 'approved': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-success/10 text-success border border-success/20 uppercase tracking-wider"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-error/10 text-error border border-error/20 uppercase tracking-wider"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default: return null;
    }
  };

  if (loading && vehicles.length === 0) {
    return <div className="animate-pulse p-10 text-center">Loading fleet data...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">Fleet Management</h1>
          <p className="text-secondary">Manage your vehicles, pricing, and availability.</p>
        </div>
        <Link to="/vendor/add-vehicle" className="btn btn-primary shadow-lg shadow-primary/20">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Vehicle
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search fleet by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2.5 text-body-sm outline-none focus:border-accent transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No Vehicles Found"
          description={searchTerm ? "No vehicles match your search criteria." : "You haven't added any vehicles to your fleet yet."}
          action={!searchTerm ? { label: "Add Your First Vehicle", onClick: () => window.location.href = '/vendor/add-vehicle' } : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <motion.div variants={staggerItem} key={vehicle._id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              
              {/* Image & Status */}
              <div className="relative h-48 bg-surface">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img src={vehicle.images[0].url} alt={vehicle.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
                )}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-secondary hover:text-accent transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-secondary hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-caption text-accent font-semibold uppercase">{vehicle.brand}</span>
                    <h3 className="text-lg font-bold text-primary leading-tight">{vehicle.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-body font-bold text-primary">₹{vehicle.pricePerDay?.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Per Day</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Category</p>
                    <p className="text-body-sm font-medium text-primary capitalize">{vehicle.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Location</p>
                    <p className="text-body-sm font-medium text-primary truncate">{vehicle.location?.city}</p>
                  </div>
                </div>

                {vehicle.status === 'rejected' && (
                  <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error font-medium">
                    Please review admin feedback and update.
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
