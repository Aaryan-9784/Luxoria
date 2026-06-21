import fs from 'fs';
fs.writeFileSync('out.txt', 'started\n');
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

try {
  dotenv.config();

  await mongoose.connect(process.env.MONGODB_URI);
  fs.appendFileSync('out.txt', 'Connected to DB\n');
  
  const user = new User({
    name: 'Test Google User',
    email: 'testgoogleuser' + Date.now() + '@example.com',
    googleId: '1234567890',
    avatar: {
      url: 'http://example.com/photo.jpg',
      publicId: '',
    },
    isVerified: true,
  });
  
  await user.save();
  fs.appendFileSync('out.txt', 'User created successfully: ' + user._id + '\n');
  
  await User.deleteOne({ _id: user._id });
  
} catch (error) {
  fs.appendFileSync('out.txt', 'Error creating user: ' + error.stack + '\n');
} finally {
  await mongoose.disconnect();
}
