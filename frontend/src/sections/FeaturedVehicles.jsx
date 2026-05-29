import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem, EASE_LUXE } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/Typography';
import VehicleCard from '@/components/ui/VehicleCard';

const FEATURED_VEHICLES = [
  {
    id: '1',
    name: 'Rolls-Royce Cullinan',
    brand: 'Rolls-Royce',
    pricePerDay: 4500,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop',
    category: 'Luxury SUV',
    seats: 5,
    transmission: 'Auto',
    fuelType: 'Petrol',
    rating: 5.0,
    badge: 'Ultra Luxury',
    horsepower: '563 HP',
    topSpeed: '250 km/h',
    zeroToHundred: '5.2 sec'
  },
  {
    id: '2',
    name: 'Ferrari SF90 Stradale',
    brand: 'Ferrari',
    pricePerDay: 3500,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
    category: 'Hypercar',
    seats: 2,
    transmission: 'Auto',
    fuelType: 'Hybrid',
    rating: 4.9,
    badge: 'Track Focused',
    horsepower: '986 HP',
    topSpeed: '340 km/h',
    zeroToHundred: '2.5 sec'
  },
  {
    id: '3',
    name: 'Porsche Taycan Turbo GT',
    brand: 'Porsche',
    pricePerDay: 2200,
    image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2070&auto=format&fit=crop',
    category: 'Electric',
    seats: 4,
    transmission: 'Auto',
    fuelType: 'Electric',
    rating: 4.8,
    badge: 'New Arrival',
    horsepower: '1019 HP',
    topSpeed: '290 km/h',
    zeroToHundred: '2.2 sec'
  },
  {
    id: '4',
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200',
    category: 'Electric',
    seats: 5,
    transmission: 'Auto',
    fuelType: 'Electric',
    rating: 4.7,
    badge: 'Most Popular',
    horsepower: '1020 HP',
    topSpeed: '322 km/h',
    zeroToHundred: '2.1 sec'
  },
];

export default function FeaturedVehicles() {
  return (
    <section className="section-spacing bg-surface">
      <div className="container-luxe">
        <SectionHeader
          overline="Our Collection"
          title="Featured Vehicles"
          description="Experience the pinnacle of automotive engineering with our handpicked selection of the world's most prestigious vehicles."
        >
          <Link
            to="/vehicles"
            className="group flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionHeader>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="vehicle-grid"
        >
          {FEATURED_VEHICLES.map((vehicle) => (
            <motion.div key={vehicle.id} variants={staggerItem}>
              <VehicleCard {...vehicle} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
