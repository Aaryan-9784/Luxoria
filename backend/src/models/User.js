import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      },
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.__v;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ role: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove expired refresh tokens
userSchema.methods.cleanExpiredTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(
    (t) => t.expiresAt > new Date()
  );
};

const User = mongoose.model('User', userSchema);

export default User;
