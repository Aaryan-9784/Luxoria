import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import CollectionHero from './components/collection/CollectionHero';
import CollectionFilter from './components/collection/CollectionFilter';
import VehicleGrid from './components/collection/VehicleGrid';
import FeaturedVehicle from './components/collection/FeaturedVehicle';
import MembershipCTA from './components/collection/MembershipCTA';
import { vehicles as allVehicles } from './components/collection/data';

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState('All Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');

  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...allVehicles];

    // Filter by Category
    if (activeCategory !== 'All Vehicles') {
      result = result.filter(v => v.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      let lowerQuery = searchQuery.toLowerCase();
      // Handle common typos or variations for luxury
      if (lowerQuery.includes('laxurious') || lowerQuery.includes('luxurious')) {
        lowerQuery = lowerQuery.replace(/laxurious|luxurious/g, 'luxury');
      }

      result = result.filter(v => 
        v.name.toLowerCase().includes(lowerQuery) || 
        v.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    switch (sortBy) {
      case 'Price High-Low':
        result.sort((a, b) => {
          const priceA = parseInt(a.startingPrice.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.startingPrice.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'Price Low-High':
        result.sort((a, b) => {
          const priceA = parseInt(a.startingPrice.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.startingPrice.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'Name A-Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name Z-A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Newest':
        // Mock random order for newest
        break;
      default:
        // Most Popular (default)
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-background">
      <CollectionHero />
      
      <CollectionFilter 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      <VehicleGrid vehicles={filteredAndSortedVehicles} />
      
      <FeaturedVehicle />
      
      <MembershipCTA />
    </motion.div>
  );
}
