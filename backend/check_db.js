import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './src/models/Vehicle.js';
import User from './src/models/User.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const vehicles = await Vehicle.find().populate('vendor');
  console.log(JSON.stringify(vehicles.slice(0, 2), null, 2));
  process.exit(0);
}

check();
