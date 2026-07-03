import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LuxuryVehicleCard from '@/pages/vehicles/components/LuxuryVehicleCard';
import { fetchFeaturedVehicles, setQuickView, addToCompare } from '@/redux/slices/vehicleSlice';
import { toggleWishlist, fetchWishlist } from '@/redux/slices/dashboardSlice';
import { HOME_FEATURED_VEHICLES } from './FeaturedVehicles';

/**
 * Normalise a DB vehicle document into the shape LuxuryVehicleCard expects.
 */
function normaliseVehicle(v) {
  return {
    id: v._id || v.id,
    name: v.name,
    brand: v.brand,
    image: v.images?.[0]?.url || v.image || null,
    pricePerDay: v.pricePerDay,
    category: v.category,
    rating: v.rating,
    seats: v.seats,
    transmission: v.transmission,
    fuelType: v.fuelType,
    topSpeed: v.topSpeed,
    horsepower: v.horsepower,
    location: v.location?.city || v.location || null,
    isAvailable: v.availability === 'available' || v.isAvailable,
  };
}

export default function SignatureCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredVehicles, loading } = useSelector((state) => state.vehicle);
  const { wishlist: dashboardWishlist } = useSelector((state) => state.dashboard);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Build a Set of wishlisted vehicle IDs for O(1) lookup
  const wishlistedIds = React.useMemo(() => {
    return new Set(
      dashboardWishlist
        .map(w => w.vehicle?._id || w.vehicle?.id || w.vehicleId)
        .filter(Boolean)
    );
  }, [dashboardWishlist]);

  useEffect(() => {
    if (featuredVehicles.length === 0) {
      dispatch(fetchFeaturedVehicles());
    }
  }, [dispatch, featuredVehicles.length]);

  // Load wishlist from API when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Use live data if available, otherwise fall back to static mock data
  const rawVehicles = featuredVehicles.length > 0 ? featuredVehicles : HOME_FEATURED_VEHICLES;
  const vehicles = rawVehicles.slice(0, 6).map(normaliseVehicle);

  /* ── Handlers ── */
  const handleWishlistToggle = (vehicleId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const vehicleObj = vehicles.find(v => v.id === vehicleId);
    dispatch(toggleWishlist({ vehicleId, vehicle: vehicleObj })).then((result) => {
      if (toggleWishlist.fulfilled.match(result) && result.payload.action === 'added') {
        dispatch(fetchWishlist());
      }
    });
  };

  const handleShare = async (vehicle) => {
    const url = `${window.location.origin}/vehicles/${vehicle.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${vehicle.brand} ${vehicle.name}`, text: `Check out this ${vehicle.brand} ${vehicle.name} on Luxoria!`, url });
      } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <section className="py-[140px] bg-background">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">The Collection</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Signature <br /> <span className="text-secondary italic font-light lowercase">fleet</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/vehicles" className="group flex items-center gap-3 text-primary font-medium hover:text-accent transition-colors pb-2 border-b border-primary hover:border-accent uppercase tracking-widest text-sm">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        {loading && featuredVehicles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface border border-border/40 overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-border/20" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-border/20 rounded w-1/3" />
                  <div className="h-5 bg-border/20 rounded w-2/3" />
                  <div className="h-3 bg-border/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <LuxuryVehicleCard
                  vehicle={vehicle}
                  isWishlisted={wishlistedIds.has(vehicle.id)}
                  onWishlist={handleWishlistToggle}
                  onQuickView={(v) => dispatch(setQuickView(v))}
                  onCompare={(v) => dispatch(addToCompare(v))}
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
