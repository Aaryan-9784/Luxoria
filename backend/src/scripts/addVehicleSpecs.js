/**
 * Migration: Add horsepower, topSpeed, engine to existing vehicles
 * Run: node src/scripts/addVehicleSpecs.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Vehicle from '../models/Vehicle.js';

const SPECS = {
  'Ghost Series II': { horsepower: '571 HP',  topSpeed: '250 km/h', engine: '6.75L V12 Twin-Turbo' },
  '296 GTB':         { horsepower: '830 HP',  topSpeed: '330 km/h', engine: '3.0L V6 Hybrid' },
  'Mistral':         { horsepower: '1600 HP', topSpeed: '420 km/h', engine: '8.0L W16 Quad-Turbo' },
  'Huracán EVO':     { horsepower: '640 HP',  topSpeed: '325 km/h', engine: '5.2L V10' },
  '911 Turbo S':     { horsepower: '650 HP',  topSpeed: '330 km/h', engine: '3.8L Flat-6 Twin-Turbo' },
  '720S':            { horsepower: '710 HP',  topSpeed: '341 km/h', engine: '4.0L V8 Twin-Turbo' },
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    for (const [name, specs] of Object.entries(SPECS)) {
      const result = await Vehicle.updateMany(
        { name, $or: [{ horsepower: { $exists: false } }, { horsepower: null }, { horsepower: '' }] },
        { $set: specs }
      );
      if (result.modifiedCount > 0) {
        console.log(`✓ Updated "${name}" — ${result.modifiedCount} doc(s)`);
        updated += result.modifiedCount;
      } else {
        console.log(`- "${name}" already has specs or not found`);
      }
    }

    console.log(`\nDone. ${updated} vehicle(s) updated.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

run();
