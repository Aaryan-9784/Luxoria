import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConciergeRequest from './src/models/ConciergeRequest.js';

dotenv.config();

const DUMMY_REQUESTS = [
  {
    requestId: 'CR-9012',
    clientName: 'Alexander Sterling',
    type: 'Security Detail',
    status: 'pending',
    date: new Date('2026-06-25T14:00:00Z'),
    description: 'Client requires two armed close protection officers for the Rolls-Royce Phantom booking tomorrow evening.',
    priority: 'high',
    icon: 'ShieldAlert',
    location: 'London, UK'
  },
  {
    requestId: 'CR-9013',
    clientName: 'Victoria Blackwood',
    type: 'Custom Beverage',
    status: 'in-progress',
    date: new Date('2026-06-25T09:30:00Z'),
    description: 'Requested 1996 Dom Pérignon chilled in the Maybach rear console upon airport arrival.',
    priority: 'medium',
    icon: 'Wine',
    location: 'Dubai, UAE'
  },
  {
    requestId: 'CR-9014',
    clientName: 'James Rutherford',
    type: 'Helicopter Transfer',
    status: 'completed',
    date: new Date('2026-06-24T18:45:00Z'),
    description: 'Helicopter transfer from JFK Airport to Manhattan helipad before the Lamborghini Urus rental.',
    priority: 'high',
    icon: 'Sparkles',
    location: 'New York, USA'
  },
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  await ConciergeRequest.deleteMany({});
  console.log('Cleared existing concierge requests');
  
  await ConciergeRequest.insertMany(DUMMY_REQUESTS);
  console.log('Seeded database with dummy requests');
  
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
