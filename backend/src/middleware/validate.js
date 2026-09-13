import ApiError from '../utils/ApiError.js';

/**
 * Validate request body/query/params against a Joi schema
 * @param {Object} schema - Joi schema object with body, query, params keys
 */
const validate = (schema) => (req, res, next) => {
  const validationErrors = [];

  ['body', 'query', 'params'].forEach((key) => {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, ''),
        }));
        validationErrors.push(...errors);
      } else {
        req[key] = value;
      }
    }
  });

  if (validationErrors.length > 0) {
    throw ApiError.badRequest('Validation failed', validationErrors);
  }

  next();
};

export default validate;
