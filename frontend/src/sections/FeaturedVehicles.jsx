import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem, EASE_LUXE } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/Typography';
import LuxuryVehicleCard from '@/pages/vehicles/components/LuxuryVehicleCard';

export const HOME_FEATURED_VEHICLES = [
  {
    id: 'feat-1',
    name: 'Ghost Series II',
    brand: 'Rolls-Royce',
    image: 'https://calibremag.com/wp-content/uploads/2025/04/Rolls-Royce-Ghost-Series-II-Scotland-2025-CALIBRE-01.webp',
    pricePerDay: 2500,
    category: 'luxury',
    rating: { average: 4.9, count: 128 },
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '250 km/h',
    horsepower: '571 HP',
    engine: '6.75L V12 Twin-Turbo',
    location: 'Mumbai',
    isAvailable: true,
    badge: 'Editors Choice',
    features: ['Starlight Headliner', 'Bespoke Audio', 'Night Vision', 'Massage Seats', 'Champagne Cooler'],
  },
  {
    id: 'feat-2',
    name: '296 GTB',
    brand: 'Ferrari',
    image: 'https://images.collectingcars.com/081193/AS-01-10-06.jpg?w=1920&q=95',
    pricePerDay: 3200,
    category: 'sports',
    rating: { average: 4.8, count: 96 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'hybrid',
    topSpeed: '330 km/h',
    horsepower: '830 HP',
    engine: '3.0L V6 Hybrid',
    location: 'Delhi',
    isAvailable: true,
    badge: 'Most Popular',
    features: ['Carbon Fiber Body', 'Fiorano Package', 'Racing Seats', 'Telemetry System', 'Track Mode'],
  },
  {
    id: 'feat-3',
    name: 'Mistral',
    brand: 'Bugatti',
    image: 'https://cdn.motor1.com/images/mgl/eoBpg8/s1/bugatti-brouillard.webp',
    pricePerDay: 15000,
    category: 'sports',
    rating: { average: 5.0, count: 82 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '420 km/h',
    horsepower: '1600 HP',
    engine: '8.0L W16 Quad-Turbo',
    location: 'Bangalore',
    isAvailable: true,
    badge: 'Highest Rated',
    features: ['Diamond Knurling', 'Rotating Display', 'Naim Audio', 'Handcrafted Interior', 'All-Wheel Drive'],
  },
  {
    id: 'feat-4',
    name: 'Huracán EVO',
    brand: 'Lamborghini',
    image: 'https://houstonexotics.blob.core.windows.net/ech-ga12749/full/1img4066.jpg',
    pricePerDay: 2800,
    category: 'sports',
    rating: { average: 4.7, count: 84 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '325 km/h',
    horsepower: '640 HP',
    engine: '5.2L V10',
    location: 'Mumbai',
    isAvailable: true,
    badge: 'Supercar',
    features: ['LDVI System', 'ALA Aero', 'Corsa Mode', 'Carbon Ceramics', 'Performante Kit'],
  },
  {
    id: 'feat-5',
    name: '911 Turbo S',
    brand: 'Porsche',
    image: 'https://images.collectingcars.com/023148/DSC03123-EDITED.jpg?w=3840&q=75',
    pricePerDay: 2200,
    category: 'sports',
    rating: { average: 4.8, count: 210 },
    seats: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '330 km/h',
    horsepower: '650 HP',
    engine: '3.8L Flat-6 Twin-Turbo',
    location: 'Delhi',
    isAvailable: false,
    badge: 'Iconic',
    features: ['Sport Chrono', 'PCCB Brakes', 'Active Aero', 'Sport Exhaust', 'PDK Transmission'],
  },
  {
    id: 'feat-6',
    name: '720S',
    brand: 'McLaren',
    image: 'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/628/timestamped-1722570747278-2018%20McLaren%20720S_001.jpg?width=3840&quality=75',
    pricePerDay: 2500,
    category: 'sports',
    rating: { average: 4.9, count: 110 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '341 km/h',
    horsepower: '710 HP',
    engine: '4.0L V8 Twin-Turbo',
    location: 'Hyderabad',
    isAvailable: true,
    badge: 'Ultra Luxury',
    features: ['Executive Rear Seats', 'Burmester 4D', 'Magic Body Control', 'Rear Entertainment', 'Fragrance System'],
  }
];

export default function FeaturedVehicles() {
  return (
    <section className="pt-24 md:pt-32 pb-8 md:pb-12 bg-surface">
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
          {HOME_FEATURED_VEHICLES.slice(0, 6).map((vehicle) => (
            <motion.div key={vehicle.id} variants={staggerItem}>
              <LuxuryVehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
