import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import CollectionHero from './components/collection/CollectionHero';
import CollectionStatistics from './components/collection/CollectionStatistics';
import CollectionFilter from './components/collection/CollectionFilter';
import BrandShowcase from './components/collection/BrandShowcase';
import VehicleGrid from './components/collection/VehicleGrid';
import FeaturedVehicle from './components/collection/FeaturedVehicle';
import VehicleComparisonModal from './components/collection/VehicleComparisonModal';
import LuxuryExperience from './components/collection/LuxuryExperience';
import CustomerTestimonials from './components/collection/CustomerTestimonials';
import FooterCTA from './components/collection/FooterCTA';

import { vehicles as allVehicles } from './components/collection/data';

export default function CollectionPage() {
  // Advanced Filter State
  const [activeCategory, setActiveCategory] = useState('All Vehicles');
  const [activeBrand, setActiveBrand] = useState('All Brands');
  const [activeLocation, setActiveLocation] = useState('All Locations');
  const [activeTransmission, setActiveTransmission] = useState('All');
  const [activeFuelType, setActiveFuelType] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 20000]); // Daily price range
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  
  // Comparison State
  const [compareVehicles, setCompareVehicles] = useState([]);

  const toggleCompare = (vehicle) => {
    setCompareVehicles(prev => {
      const exists = prev.find(v => v.id === vehicle.id);
      if (exists) {
        return prev.filter(v => v.id !== vehicle.id);
      }
      if (prev.length < 3) {
        return [...prev, vehicle];
      }
      return prev;
    });
  };

  const removeCompare = (vehicleId) => {
    setCompareVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...allVehicles];

    // Filter by Category
    if (activeCategory !== 'All Vehicles') {
      result = result.filter(v => v.category === activeCategory);
    }
    
    // Filter by Brand
    if (activeBrand !== 'All Brands') {
      result = result.filter(v => v.brand === activeBrand);
    }

    // Filter by Location
    if (activeLocation !== 'All Locations') {
      result = result.filter(v => v.location === activeLocation);
    }

    // Filter by Transmission
    if (activeTransmission !== 'All') {
      result = result.filter(v => v.transmission === activeTransmission);
    }

    // Filter by Fuel Type
    if (activeFuelType !== 'All') {
      result = result.filter(v => v.fuelType === activeFuelType);
    }

    // Filter by Price Range (Daily Price)
    result = result.filter(v => v.dailyPrice >= priceRange[0] && v.dailyPrice <= priceRange[1]);

    // Filter by Search Query (Name or Brand)
    if (searchQuery.trim()) {
      let lowerQuery = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(lowerQuery) || 
        v.brand.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    switch (sortBy) {
      case 'Price High-Low':
        result.sort((a, b) => b.dailyPrice - a.dailyPrice);
        break;
      case 'Price Low-High':
        result.sort((a, b) => a.dailyPrice - b.dailyPrice);
        break;
      case 'Name A-Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name Z-A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Top Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Recommended':
      default:
        // Use default order from array for recommended
        break;
    }

    return result;
  }, [activeCategory, activeBrand, activeLocation, activeTransmission, activeFuelType, priceRange, searchQuery, sortBy]);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-[#fafafa]">
      {/* 1. Hero Section */}
      <CollectionHero />
      
      {/* 2. Collection Statistics */}
      <CollectionStatistics />

      {/* 3. Advanced Search Section */}
      <CollectionFilter 
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        activeBrand={activeBrand} setActiveBrand={setActiveBrand}
        activeLocation={activeLocation} setActiveLocation={setActiveLocation}
        activeTransmission={activeTransmission} setActiveTransmission={setActiveTransmission}
        activeFuelType={activeFuelType} setActiveFuelType={setActiveFuelType}
        priceRange={priceRange} setPriceRange={setPriceRange}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        sortBy={sortBy} setSortBy={setSortBy}
        resultsCount={filteredAndSortedVehicles.length}
      />

      {/* 4. Brand Showcase */}
      <BrandShowcase />
      
      {/* 5. Vehicle Collection Grid */}
      <VehicleGrid 
        vehicles={filteredAndSortedVehicles} 
        compareVehicles={compareVehicles}
        toggleCompare={toggleCompare}
      />
      
      {/* 6. Featured Collection Section */}
      <FeaturedVehicle />

      {/* 8. Luxury Experience Section */}
      <LuxuryExperience />

      {/* 9. Customer Testimonials */}
      <CustomerTestimonials />
      
      {/* 10. Footer CTA */}
      <FooterCTA />

      {/* 7. Vehicle Comparison Feature (Modal) */}
      <AnimatePresence>
        {compareVehicles.length > 0 && (
          <VehicleComparisonModal 
            vehicles={compareVehicles} 
            removeCompare={removeCompare}
            clearCompare={() => setCompareVehicles([])}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
