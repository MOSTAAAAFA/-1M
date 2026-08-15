const Joi = require('joi');

const productSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2030).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  description: Joi.string().max(2000).optional(),
  specs: Joi.object({
    engine: Joi.string().required(),
    horsepower: Joi.number().positive().required(),
    torque: Joi.string().required(),
    transmission: Joi.string().required(),
    drivetrain: Joi.string().required(),
    acceleration: Joi.string().required(),
    topSpeed: Joi.string().required(),
    fuelEconomy: Joi.string().required(),
    seating: Joi.number().integer().positive().required(),
    cargo: Joi.string().required()
  }).required(),
  stock: Joi.number().integer().min(0).default(0),
  featured: Joi.boolean().default(false),
  category: Joi.string().valid('sports', 'suv', 'sedan', 'electric').default('sports')
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    next();
  };
};

module.exports = {
  validateProduct: validate(productSchema)
};
