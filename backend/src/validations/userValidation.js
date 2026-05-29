import Joi from 'joi';

export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^[+]?[\d\s-]{10,15}$/).optional().allow(''),
    address: Joi.object({
      street: Joi.string().trim().max(200).optional().allow(''),
      city: Joi.string().trim().max(100).optional().allow(''),
      state: Joi.string().trim().max(100).optional().allow(''),
      zip: Joi.string().trim().max(20).optional().allow(''),
      country: Joi.string().trim().max(100).optional().allow(''),
    }).optional(),
  }),
};
