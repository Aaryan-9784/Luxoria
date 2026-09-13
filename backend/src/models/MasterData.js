import mongoose from 'mongoose';

const masterDataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['brand', 'city', 'feature', 'vehicleType', 'faq'],
      required: [true, 'Category is required'],
      index: true,
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Value is required'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
masterDataSchema.index({ category: 1, isActive: 1 });
masterDataSchema.index({ category: 1, sortOrder: 1 });

const MasterData = mongoose.model('MasterData', masterDataSchema);

export default MasterData;
