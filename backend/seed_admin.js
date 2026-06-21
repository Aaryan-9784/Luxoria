import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const existingAdmin = await usersCollection.findOne({ email: 'admin@luxoria.com' });
    
    if (existingAdmin) {
      // Ensure it's definitely an admin
      await usersCollection.updateOne({ email: 'admin@luxoria.com' }, { $set: { role: 'admin' } });
      console.log('Admin account already exists and role is verified.');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      
      const adminUser = {
        name: 'Super Admin',
        email: 'admin@luxoria.com',
        password: hashedPassword,
        phone: '9999999999',
        role: 'admin',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(adminUser);
      console.log('Successfully created new Admin account!');
    }
    
    console.log('\n--- ADMIN CREDENTIALS ---');
    console.log('Email:    admin@luxoria.com');
    console.log('Password: Admin123!');
    console.log('-------------------------\n');
    
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
