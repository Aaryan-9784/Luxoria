import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

// The mock vehicles data
const FEATURED_VEHICLES = [
  {
    name: 'Ghost Series II',
    brand: 'Rolls-Royce',
    images: [{ url: 'https://calibremag.com/wp-content/uploads/2025/04/Rolls-Royce-Ghost-Series-II-Scotland-2025-CALIBRE-01.webp', publicId: 'mock-1' }],
    pricePerDay: 2500,
    category: 'luxury',
    rating: { average: 4.9, count: 128 },
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    location: { city: 'Mumbai' },
    availability: 'available',
    status: 'approved',
    features: ['Starlight Headliner', 'Bespoke Audio', 'Night Vision', 'Massage Seats', 'Champagne Cooler'],
  },
  {
    name: '296 GTB',
    brand: 'Ferrari',
    images: [{ url: 'https://images.collectingcars.com/081193/AS-01-10-06.jpg?w=1920&q=95', publicId: 'mock-2' }],
    pricePerDay: 3200,
    category: 'sports',
    rating: { average: 4.8, count: 96 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'hybrid',
    location: { city: 'Delhi' },
    availability: 'available',
    status: 'approved',
    features: ['Carbon Fiber Body', 'Fiorano Package', 'Racing Seats', 'Telemetry System', 'Track Mode'],
  },
  {
    name: 'Mistral',
    brand: 'Bugatti',
    images: [{ url: 'https://cdn.motor1.com/images/mgl/eoBpg8/s1/bugatti-brouillard.webp', publicId: 'mock-3' }],
    pricePerDay: 15000,
    category: 'sports',
    rating: { average: 5.0, count: 82 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    location: { city: 'Bangalore' },
    availability: 'available',
    status: 'approved',
    features: ['Diamond Knurling', 'Rotating Display', 'Naim Audio', 'Handcrafted Interior', 'All-Wheel Drive'],
  },
  {
    name: 'Huracán EVO',
    brand: 'Lamborghini',
    images: [{ url: 'https://houstonexotics.blob.core.windows.net/ech-ga12749/full/1img4066.jpg', publicId: 'mock-4' }],
    pricePerDay: 2800,
    category: 'sports',
    rating: { average: 4.7, count: 84 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    location: { city: 'Mumbai' },
    availability: 'available',
    status: 'approved',
    features: ['LDVI System', 'ALA Aero', 'Corsa Mode', 'Carbon Ceramics', 'Performante Kit'],
  },
  {
    name: '911 Turbo S',
    brand: 'Porsche',
    images: [{ url: 'https://images.collectingcars.com/023148/DSC03123-EDITED.jpg?w=3840&q=75', publicId: 'mock-5' }],
    pricePerDay: 2200,
    category: 'sports',
    rating: { average: 4.8, count: 210 },
    seats: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    location: { city: 'Delhi' },
    availability: 'booked',
    status: 'approved',
    features: ['Sport Chrono', 'PCCB Brakes', 'Active Aero', 'Sport Exhaust', 'PDK Transmission'],
  },
  {
    name: '720S',
    brand: 'McLaren',
    images: [{ url: 'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/628/timestamped-1722570747278-2018%20McLaren%20720S_001.jpg?width=3840&quality=75', publicId: 'mock-6' }],
    pricePerDay: 2500,
    category: 'sports',
    rating: { average: 4.9, count: 110 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    location: { city: 'Hyderabad' },
    availability: 'available',
    status: 'approved',
    features: ['Executive Rear Seats', 'Burmester 4D', 'Magic Body Control', 'Rear Entertainment', 'Fragrance System'],
  },
];

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await Vehicle.deleteMany();
    console.log('Cleared existing vehicles.');

    // Find or create a vendor
    let vendor = await User.findOne({ role: 'vendor' });
    if (!vendor) {
      vendor = await User.create({
        name: 'Sovereign Elite Mobility',
        email: 'elite@luxoria.com',
        password: 'Password@123!',
        role: 'vendor',
        isEmailVerified: true
      });
      console.log('Created mock vendor: Elite Motors');
    }

    // Add vendor reference and slug to vehicles
    const vehiclesWithVendor = FEATURED_VEHICLES.map((vehicle, index) => {
      return { 
        ...vehicle, 
        vendor: vendor._id,
        slug: vehicle.name.toLowerCase().replace(/\s+/g, '-') + '-' + index
      };
    });

    await Vehicle.insertMany(vehiclesWithVendor);
    console.log(`Successfully seeded ${vehiclesWithVendor.length} luxury vehicles!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
