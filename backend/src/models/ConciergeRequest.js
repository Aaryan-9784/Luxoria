import mongoose from 'mongoose';

const conciergeRequestSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // User is optional right now since these might be manually created requests for clients
    },
    requestId: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'Request type is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    icon: {
      type: String, // String representation of the Lucide icon, e.g., 'ShieldAlert'
      default: 'Sparkles',
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
conciergeRequestSchema.index({ status: 1 });
conciergeRequestSchema.index({ requestId: 1 });

// Generate request ID before save
conciergeRequestSchema.pre('save', function (next) {
  if (!this.requestId) {
    // Generate a unique ID like CR-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.requestId = `CR-${randomNum}`;
  }
  next();
});

const ConciergeRequest = mongoose.model('ConciergeRequest', conciergeRequestSchema);

export default ConciergeRequest;
