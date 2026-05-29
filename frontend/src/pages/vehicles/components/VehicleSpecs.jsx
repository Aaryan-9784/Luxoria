import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, Gauge, Users, Fuel, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function VehicleSpecs({ vehicle }) {
  if (!vehicle) return null;

  const specs = [
    { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Users, label: 'Seats', value: `${vehicle.seats} Adults` },
    { icon: Calendar, label: 'Year', value: vehicle.year },
    // Mock data for luxury feel if not in DB
    { icon: Gauge, label: 'Top Speed', value: vehicle.category === 'sports' ? '320 km/h' : '250 km/h' },
    { icon: Zap, label: '0-100 km/h', value: vehicle.category === 'sports' ? '2.9s' : '4.5s' },
  ];

  return (
    <div className="mb-16">
      <h3 className="text-h4 text-primary mb-6">Technical Specifications</h3>
      
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {specs.map((spec, idx) => (
          <motion.div 
            key={idx}
            variants={staggerItem}
            className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <spec.icon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-caption text-muted uppercase tracking-wider">{spec.label}</p>
              <p className="text-body font-semibold text-primary capitalize">{spec.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {vehicle.features && vehicle.features.length > 0 && (
        <div className="mt-12">
          <h3 className="text-h4 text-primary mb-6">Premium Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {vehicle.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-body-sm text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="capitalize">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
