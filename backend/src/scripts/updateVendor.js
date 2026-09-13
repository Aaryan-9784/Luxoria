import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';

const updateName = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.updateOne({ role: 'vendor' }, { $set: { name: 'Sovereign Elite Mobility' } });
    console.log('Successfully updated vendor name to Sovereign Elite Mobility');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
updateName();
