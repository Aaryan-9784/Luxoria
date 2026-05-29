import Joi from 'joi';

export const createVehicleSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(150).required(),
    brand: Joi.string().trim().required(),
    model: Joi.string().trim().optional(),
    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
    category: Joi.string().valid('sedan', 'suv', 'sports', 'luxury', 'convertible', 'limousine', 'electric').required(),
    transmission: Joi.string().valid('automatic', 'manual').default('automatic'),
    fuelType: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid').default('petrol'),
    seats: Joi.number().integer().min(1).max(20).default(4),
    pricePerDay: Joi.number().positive().required(),
    features: Joi.array().items(Joi.string().trim()).optional(),
    description: Joi.string().max(2000).optional(),
    location: Joi.object({
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      address: Joi.string().trim().optional(),
    }).optional(),
  }),
};

export const updateVehicleSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(150).optional(),
    brand: Joi.string().trim().optional(),
    model: Joi.string().trim().optional(),
    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
    category: Joi.string().valid('sedan', 'suv', 'sports', 'luxury', 'convertible', 'limousine', 'electric').optional(),
    transmission: Joi.string().valid('automatic', 'manual').optional(),
    fuelType: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid').optional(),
    seats: Joi.number().integer().min(1).max(20).optional(),
    pricePerDay: Joi.number().positive().optional(),
    features: Joi.array().items(Joi.string().trim()).optional(),
    description: Joi.string().max(2000).optional(),
    location: Joi.object({
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      address: Joi.string().trim().optional(),
    }).optional(),
    availability: Joi.string().valid('available', 'booked', 'maintenance').optional(),
  }),
};
