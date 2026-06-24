import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './src/models/Booking.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const bookings = await Booking.find();
  console.log('Total bookings:', bookings.length);
  process.exit(0);
}

check();
