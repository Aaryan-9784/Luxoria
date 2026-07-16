import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './src/models/Vehicle.js';
import Booking from './src/models/Booking.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  const vehicles = await Vehicle.find({ isActive: true, status: 'approved' }).lean();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(`\n📅 Today: ${today.toDateString()}`);
  console.log('='.repeat(60));

  for (const v of vehicles) {
    const activeBookings = await Booking.find({
      vehicle: v._id,
      isActive: true,
      status: { $in: ['pending', 'confirmed', 'active'] },
      endDate: { $gte: today }, // only future/ongoing bookings
    }).sort({ startDate: 1 }).lean();

    console.log(`\n🚗 ${v.brand} ${v.name}`);
    console.log(`   Status: ${v.status} | Availability field: ${v.availability}`);

    if (activeBookings.length === 0) {
      console.log(`   ✅ FULLY AVAILABLE — no upcoming bookings`);
    } else {
      console.log(`   🔴 BOOKED on these dates:`);
      for (const b of activeBookings) {
        const start = new Date(b.startDate).toDateString();
        const end   = new Date(b.endDate).toDateString();
        console.log(`      • ${start}  →  ${end}  (status: ${b.status})`);
      }

      // Figure out next available window
      const lastEnd = new Date(activeBookings[activeBookings.length - 1].endDate);
      lastEnd.setDate(lastEnd.getDate() + 1);
      console.log(`   ✅ AVAILABLE FROM: ${lastEnd.toDateString()}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  process.exit(0);
}

check().catch(err => { console.error(err); process.exit(1); });
