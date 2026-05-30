import Joi from 'joi';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(passwordPattern).required().messages({
      'string.pattern.base': passwordMessage,
    }),
    phone: Joi.string().pattern(/^[+]?[\d\s-]{10,15}$/).optional(),
    role: Joi.string().valid('user', 'vendor').default('user'),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),
};

export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    password: Joi.string().pattern(passwordPattern).required().messages({
      'string.pattern.base': passwordMessage,
    }),
  }),
  params: Joi.object({
    token: Joi.string().required(),
  }),
};

export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordPattern).required().messages({
      'string.pattern.base': passwordMessage,
    }),
  }),
};
