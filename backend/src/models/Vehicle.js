import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: [1990, 'Year must be after 1990'],
      max: [new Date().getFullYear() + 1, 'Invalid year'],
    },
    category: {
      type: String,
      enum: ['sedan', 'suv', 'sports', 'luxury', 'convertible', 'limousine', 'electric'],
      required: [true, 'Category is required'],
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'automatic',
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      default: 'petrol',
    },
    seats: {
      type: Number,
      min: [1, 'Must have at least 1 seat'],
      max: [20, 'Cannot exceed 20 seats'],
      default: 4,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    features: [{ type: String, trim: true }],
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    horsepower: {
      type: String,
      trim: true,
    },
    topSpeed: {
      type: String,
      trim: true,
    },
    engine: {
      type: String,
      trim: true,
    },
    location: {
      city: { type: String, trim: true, index: true },
      state: { type: String, trim: true },
      address: { type: String, trim: true },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    availability: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Pre-save: generate a unique slug from name ─────────────────────────────
vehicleSchema.pre('save', async function (next) {
  if (!this.isModified('name') && this.slug) return next();

  // Build base slug: lowercase, replace spaces/special chars with hyphens
  const base = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // Append a short random suffix to guarantee uniqueness without a DB lookup loop
  const suffix = Math.random().toString(36).slice(2, 7); // 5 alphanumeric chars
  this.slug = `${base}-${suffix}`;

  next();
});

// Compound indexes
vehicleSchema.index({ brand: 1, category: 1 });
vehicleSchema.index({ status: 1, isActive: 1 });
vehicleSchema.index({ vendor: 1, status: 1 });

// Text index for search
vehicleSchema.index(
  { name: 'text', brand: 'text', model: 'text', description: 'text' },
  { weights: { name: 10, brand: 8, model: 6, description: 2 } }
);

// Virtual for reviews
vehicleSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'vehicle',
  justOne: false,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
