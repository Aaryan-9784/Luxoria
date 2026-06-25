export const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ADMIN: 'admin',
};

export const VEHICLE_CATEGORIES = [
  'sedan',
  'suv',
  'sports',
  'luxury',
  'convertible',
  'limousine',
  'electric',
];

export const TRANSMISSION_TYPES = ['automatic', 'manual'];

export const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'];

export const VEHICLE_AVAILABILITY = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
};

export const VEHICLE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  CREATED: 'created',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const NOTIFICATION_TYPES = [
  'booking',
  'payment',
  'approval',
  'system',
  'review',
];

export const MASTER_DATA_CATEGORIES = [
  'brand',
  'city',
  'feature',
  'vehicleType',
  'faq',
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const RATE_LIMITS = {
  GENERAL: { windowMs: 15 * 60 * 1000, max: 1000 },
  AUTH: { windowMs: 15 * 60 * 1000, max: 100 },
  UPLOAD: { windowMs: 15 * 60 * 1000, max: 100 },
};

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  FOLDERS: {
    VEHICLES: 'luxoria/vehicles',
    AVATARS: 'luxoria/avatars',
    REVIEWS: 'luxoria/reviews',
  },
};
