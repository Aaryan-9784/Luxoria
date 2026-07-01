/**
 * One-time migration: clear null/undefined slugs on existing vehicles
 * so the unique sparse index stops blocking new vehicle creation.
 *
 * Run with:
 *   node --experimental-vm-modules src/scripts/fixVehicleSlugs.js
 * or (if package.json has "type":"module"):
 *   node src/scripts/fixVehicleSlugs.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Vehicle from '../models/Vehicle.js';

const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find every vehicle whose slug is null, undefined, or empty string
  const vehicles = await Vehicle.find({
    $or: [{ slug: null }, { slug: { $exists: false } }, { slug: '' }],
  });

  console.log(`Found ${vehicles.length} vehicle(s) with missing slug`);

  for (const v of vehicles) {
    v.slug = generateSlug(v.name);
    await v.save({ validateBeforeSave: false });
    console.log(`  Fixed: "${v.name}" → slug: ${v.slug}`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
