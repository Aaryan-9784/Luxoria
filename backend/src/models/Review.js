import mongoose from 'mongoose';
import Vehicle from './Vehicle.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per vehicle
reviewSchema.index({ user: 1, vehicle: 1 }, { unique: true });

// Recalculate vehicle average rating after save
reviewSchema.post('save', async function () {
  await updateVehicleRating(this.vehicle);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateVehicleRating(doc.vehicle);
  }
});

async function updateVehicleRating(vehicleId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { vehicle: vehicleId, isActive: true } },
    {
      $group: {
        _id: '$vehicle',
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      'rating.average': Math.round(stats[0].average * 10) / 10,
      'rating.count': stats[0].count,
    });
  } else {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      'rating.average': 0,
      'rating.count': 0,
    });
  }
}

const Review = mongoose.model('Review', reviewSchema);

export default Review;
