import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleById } from '@/redux/slices/vehicleSlice';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import VehicleGallery from './components/VehicleGallery';
import VehicleHeroInfo from './components/VehicleHeroInfo';
import VehicleSpecs from './components/VehicleSpecs';
import FloatingBookingWidget from './components/FloatingBookingWidget';
import Skeleton from '@/components/ui/Skeleton';
import { ShieldCheck, MessageSquare, BadgeCheck } from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vehicleDetails: vehicle, loading, error } = useSelector(state => state.vehicle);

  useEffect(() => {
    dispatch(fetchVehicleById(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  if (loading || !vehicle) {
    return (
      <div className="pt-28 container-luxe section-spacing min-h-screen">
        <Skeleton className="w-full h-[60vh] rounded-3xl mb-8" />
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-4">
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="w-full h-32 mt-8" />
          </div>
          <div className="w-full lg:w-[420px]">
            <Skeleton className="w-full h-[400px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20 container-luxe text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-h3 text-error mb-4">Vehicle Not Found</h2>
        <p className="text-secondary mb-8">{error}</p>
        <button onClick={() => navigate('/vehicles')} className="btn btn-primary">
          Back to Fleet
        </button>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="pt-28 pb-20 bg-background min-h-screen">
      <div className="container-luxe">
        {/* 1. Cinematic Gallery */}
        <div className="mb-12">
          <VehicleGallery images={vehicle.images || (vehicle.image ? [{ url: vehicle.image }] : [])} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* ── Left Content ── */}
          <div className="flex-1 min-w-0">
            {/* 2. Hero Info */}
            <VehicleHeroInfo vehicle={vehicle} />

            {/* 3. Specifications */}
            <VehicleSpecs vehicle={vehicle} />

            {/* 4. Vendor Info */}
            <div className="mt-16 pt-12 border-t border-border">
              <h3 className="text-h4 text-primary mb-6">Provided By</h3>
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-surface border border-border">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden shrink-0">
                  {vehicle.vendor?.avatar?.url ? (
                    <img src={vehicle.vendor.avatar.url} alt={vehicle.vendor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-h4 text-accent">{vehicle.vendor?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold text-primary">{vehicle.vendor?.name}</h4>
                    <BadgeCheck className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-caption text-secondary">Verified Luxury Partner</p>
                </div>
                <button className="btn btn-outline btn-sm hidden md:flex">
                  <MessageSquare className="w-4 h-4 mr-2" /> Contact Vendor
                </button>
              </div>
            </div>

            {/* 5. Rental Policies (Accordion placeholder) */}
            <div className="mt-16 pt-12 border-t border-border">
              <h3 className="text-h4 text-primary mb-6">Rental Policies</h3>
              <div className="space-y-4 text-body-sm text-secondary">
                <div className="flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p><strong>Security Deposit:</strong> A refundable security deposit of $50,000 is required at pickup.</p>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p><strong>Mileage Limit:</strong> Includes 150km per day. Additional mileage charged at $100/km.</p>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p><strong>Fuel Policy:</strong> Full-to-Full. Return the vehicle with a full tank to avoid premium refueling charges.</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* ── Right Rail: Sticky Booking Widget ── */}
          <div className="w-full lg:w-[420px] shrink-0">
            <FloatingBookingWidget vehicle={vehicle} />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
