import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './src/models/Vehicle.js';

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Reset any vehicle stuck as 'booked' — availability is now managed by date overlap,
  // not by this field, so it should always be 'available' unless under maintenance.
  const result = await Vehicle.updateMany(
    { availability: 'booked' },
    { $set: { availability: 'available' } }
  );

  console.log(`Fixed ${result.modifiedCount} vehicle(s) — reset availability from "booked" to "available".`);
  process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });
