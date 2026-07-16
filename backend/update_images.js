import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('vehicles');

    const result = await collection.updateMany(
      { brand: 'Bugatti', name: 'Mistral' },
      { $set: { images: [{ url: 'https://bugatti-newsroom.imgix.net/a32c5a46-eb09-4a6f-ac28-35622dde9d4d/12%20BUGATTI_Roadster_launch-set?auto=format,compress&cs=srgb&sharp=10&w=380&dpr=2.625', publicId: 'mock-bugatti' }] } }
    );

    console.log(`Bugatti Mistral: ${result.modifiedCount} doc(s) updated`);
    console.log('✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
