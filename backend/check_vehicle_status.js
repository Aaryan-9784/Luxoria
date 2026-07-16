import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './src/models/Vehicle.js';
import Booking from './src/models/Booking.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  const vehicles = await Vehicle.find({ brand: /lamborghini/i });

  if (!vehicles.length) {
    console.log('No Lamborghini vehicles found in DB.');
    process.exit(0);
  }

  for (const v of vehicles) {
    console.log('\n========================================');
    console.log(`Name        : ${v.name}`);
    console.log(`ID          : ${v._id}`);
    console.log(`status      : ${v.status}      ← must be "approved" to book`);
    console.log(`availability: ${v.availability} ← must be "available" to book`);
    console.log(`isActive    : ${v.isActive}    ← must be true to book`);

    if (v.status !== 'approved' || v.availability !== 'available' || !v.isActive) {
      console.log('\n⚠️  PROBLEM FOUND:');
      if (v.status !== 'approved')       console.log(`   → status is "${v.status}" — needs admin approval`);
      if (v.availability !== 'available') console.log(`   → availability is "${v.availability}" — stuck as booked/maintenance`);
      if (!v.isActive)                    console.log(`   → isActive is false — vehicle is deactivated`);

      // If stuck as booked, check if any active booking actually exists
      if (v.availability === 'booked') {
        const activeBooking = await Booking.findOne({
          vehicle: v._id,
          isActive: true,
          status: { $in: ['pending', 'confirmed', 'active'] },
        });
        if (!activeBooking) {
          console.log('\n🔧 FIX: availability is "booked" but NO active booking exists.');
          console.log('   Run this to fix:');
          console.log(`   db.vehicles.updateOne({ _id: ObjectId("${v._id}") }, { $set: { availability: "available" } })`);
        } else {
          console.log(`\n   Active booking exists: ${activeBooking._id} (status: ${activeBooking.status})`);
        }
      }
    } else {
      console.log('\n✅ This vehicle should be bookable.');
    }
  }

  process.exit(0);
}

check().catch(err => { console.error(err); process.exit(1); });
