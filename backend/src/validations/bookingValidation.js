import Joi from 'joi';

export const createBookingSchema = {
  body: Joi.object({
    vehicleId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    pickupLocation: Joi.string().trim().allow('', null).optional(),
    dropoffLocation: Joi.string().trim().allow('', null).optional(),
    notes: Joi.string().max(500).allow('', null).optional(),
  }),
};

export const cancelBookingSchema = {
  body: Joi.object({
    cancellationReason: Joi.string().max(500).optional(),
  }),
};
