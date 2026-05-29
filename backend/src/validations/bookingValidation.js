import Joi from 'joi';

export const createBookingSchema = {
  body: Joi.object({
    vehicleId: Joi.string().required(),
    startDate: Joi.date().iso().min('now').required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    pickupLocation: Joi.string().trim().optional(),
    dropoffLocation: Joi.string().trim().optional(),
    notes: Joi.string().max(500).optional(),
  }),
};

export const cancelBookingSchema = {
  body: Joi.object({
    cancellationReason: Joi.string().max(500).optional(),
  }),
};
