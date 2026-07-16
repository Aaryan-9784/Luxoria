import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setQuickView, addToCompare } from '@/redux/slices/vehicleSlice';
import { toggleWishlist, fetchWishlist } from '@/redux/slices/dashboardSlice';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';
import { Heart, Eye, GitCompareArrows, ArrowRight, Star, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

function FeaturedCard({ vehicle, isWishlisted, onQuickView, onWishlist, onCompare }) {
  return (
    <motion.div
      variants={staggerItem}
      className="group relative overflow-hidden rounded-3xl bg-background border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-700"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative lg:w-[55%] aspect-[16/10] lg:aspect-auto overflow-hidden">
          <img
            src={vehicle.image || (vehicle.images?.length > 0 ? vehicle.images[0].url : 'https://images.unsplash.com/photo-1503376760367-11ea234057a6?auto=format&fit=crop&q=80&w=800')}
            alt={`${vehicle.brand} ${vehicle.name}`}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20 lg:to-background" />

          {/* Badge */}


          {/* Floating Actions */}
          <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 z-10">
            <button
              onClick={(e) => { e.preventDefault(); onWishlist && onWishlist(vehicle.id); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 border border-white/10 shadow-lg ${
                isWishlisted ? 'bg-accent text-white' : 'bg-black/40 text-white/80 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(vehicle); }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onCompare(vehicle); }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-lg"
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
          <span className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-1">
            {vehicle.brand}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-3 tracking-tight">
            {vehicle.name}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 mb-4 text-xs text-secondary">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-accent" />
              {vehicle.horsepower}
            </span>
            <span>{vehicle.topSpeed}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {typeof vehicle.location === 'object' ? vehicle.location?.city : vehicle.location}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-bold text-primary">
                {vehicle.rating?.average ?? (typeof vehicle.rating === 'number' ? vehicle.rating : '—')}
              </span>
            </div>
            <span className="text-xs text-muted">
              {vehicle.rating?.count ? `(${vehicle.rating.count} reviews)` : ''}
            </span>
            <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              vehicle.isAvailable
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            }`}>
              {vehicle.isAvailable ? 'Available' : 'Booked'}
            </div>
          </div>

          <div className="w-full h-px bg-border/50 mb-5" />

          {/* Price & CTA */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">${vehicle.pricePerDay?.toLocaleString()}</span>
                <span className="text-sm text-muted">/day</span>
              </div>
            </div>
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-accent transition-all duration-500 shadow-md hover:shadow-xl"
            >
              Book Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedShowcase() {
  const dispatch = useDispatch();
  const { featuredVehicles } = useSelector(state => state.vehicle);
  const { wishlist: dashboardWishlist } = useSelector(state => state.dashboard);
  const { isAuthenticated } = useSelector(state => state.auth);

  const wishlistedIds = React.useMemo(() => {
    return new Set(
      dashboardWishlist.map(w => w.vehicle?._id || w.vehicle?.id || w.vehicleId).filter(Boolean)
    );
  }, [dashboardWishlist]);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleWishlist = (vehicleId) => {
    if (!isAuthenticated) return;
    const vehicleObj = featuredVehicles.find(v => String(v.id || v._id) === String(vehicleId));
    dispatch(toggleWishlist({ vehicleId, vehicle: vehicleObj })).then((result) => {
      if (toggleWishlist.fulfilled.match(result) && result.payload.action === 'added') {
        dispatch(fetchWishlist());
      }
    });
  };

  // Use live featuredVehicles from Redux (already normalised with canonical images)
  const displayVehicles = featuredVehicles.slice(0, 3);

  return (
    <motion.section {...revealOnScroll} className="py-16 md:py-24">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-accent/60" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Handpicked Excellence</span>
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4 tracking-tight uppercase">
            FEATURED <span className="lowercase italic font-light text-secondary">vehicles</span>
          </h2>
          <p className="text-sm md:text-base text-secondary max-w-2xl mx-auto leading-relaxed">
            Our editors' selection of the most exceptional vehicles currently available
          </p>
        </div>

        {/* Featured Cards */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6"
        >
          {displayVehicles.map(vehicle => (
            <FeaturedCard
              key={vehicle.id || vehicle._id}
              vehicle={vehicle}
              isWishlisted={wishlistedIds.has(vehicle.id || vehicle._id)}
              onQuickView={(v) => dispatch(setQuickView(v))}
              onWishlist={isAuthenticated ? handleWishlist : undefined}
              onCompare={(v) => dispatch(addToCompare(v))}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
