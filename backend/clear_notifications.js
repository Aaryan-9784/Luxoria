import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/db.js';
import Notification from './src/models/Notification.js';

const clearTestNotifications = async () => {
  await connectDB();
  
  const result = await Notification.deleteMany({
    title: { $in: ['Account Approved', 'Account Rejected'] }
  });
  
  console.log('Deleted test notifications:', result.deletedCount);
  process.exit(0);
};

clearTestNotifications();
