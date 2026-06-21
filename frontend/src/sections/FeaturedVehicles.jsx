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
    name: 'Tesla Model X Plaid',
    brand: 'Tesla',
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200',
    category: 'Electric',
    seats: 7,
    transmission: 'Auto',
    fuelType: 'Electric',
    rating: 4.7,
    badge: 'Most Popular',
    horsepower: '1020 HP',
    topSpeed: '262 km/h',
    zeroToHundred: '2.5 sec'
  },
  {
    id: '5',
    name: 'Bugatti Chiron',
    brand: 'Bugatti',
    pricePerDay: 15000,
    image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=2070&auto=format&fit=crop',
    category: 'Hypercar',
    seats: 2,
    transmission: 'Auto',
    fuelType: 'Petrol',
    rating: 5.0,
    badge: 'Exclusive',
    horsepower: '1500 HP',
    topSpeed: '420 km/h',
    zeroToHundred: '2.4 sec'
  },
  {
    id: '6',
    name: 'McLaren 720S',
    brand: 'McLaren',
    pricePerDay: 1900,
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070&auto=format&fit=crop',
    category: 'Supercar',
    seats: 2,
    transmission: 'Auto',
    fuelType: 'Petrol',
    rating: 4.8,
    badge: 'Track Focused',
    horsepower: '710 HP',
    topSpeed: '341 km/h',
    zeroToHundred: '2.8 sec'
  },
  {
    id: '7',
    name: 'Lamborghini Huracan EVO',
    brand: 'Lamborghini',
    pricePerDay: 2800,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop',
    category: 'Sports Car',
    seats: 2,
    transmission: 'Auto',
    fuelType: 'Petrol',
    rating: 4.9,
    badge: 'Exotic Pick',
    horsepower: '630 HP',
    topSpeed: '325 km/h',
    zeroToHundred: '2.9 sec'
  },
  {
    id: '8',
    name: 'Rolls Royce Ghost',
    brand: 'Rolls Royce',
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2070&auto=format&fit=crop',
    category: 'Luxury Sedan',
    seats: 4,
    transmission: 'Auto',
    fuelType: 'Petrol',
    rating: 5.0,
    badge: 'New Arrival',
    horsepower: '563 HP',
    topSpeed: '250 km/h',
    zeroToHundred: '4.8 sec'
  }
];

export default function FeaturedVehicles() {
  return (
    <section className="section-spacing bg-surface">
      <div className="container-luxe">
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
              <span className="text-overline tracking-[0.2em] text-primary">Our Collection</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Featured <br /> <span className="text-secondary italic font-light lowercase">vehicles</span>
            </motion.h2>
            <motion.p
              className="text-secondary text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the pinnacle of automotive engineering with our handpicked selection of the world's most prestigious vehicles.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/vehicles" className="group flex items-center gap-3 text-primary font-medium hover:text-accent transition-colors pb-2 border-b border-primary hover:border-accent uppercase tracking-widest text-sm">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
        >
          {FEATURED_VEHICLES.slice(0, 6).map((vehicle) => (
            <motion.div key={vehicle.id} variants={staggerItem}>
              <VehicleCard {...vehicle} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
