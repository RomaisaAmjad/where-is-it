const Joi = require('joi');

const createTodoSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().allow(null, ''),
  is_completed: Joi.boolean().required().default(false)
});

const updateTodoSchema = Joi.object({
  title: Joi.string().optional().min(3).max(100),
  description: Joi.string().optional().allow(null, ''),
  is_completed: Joi.boolean().optional()
}).min(1);

module.exports = {
  createTodoSchema,
  updateTodoSchema
};