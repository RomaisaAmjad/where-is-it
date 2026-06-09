const Joi = require('joi');

const createItemSchema = Joi.object({
  item_name: Joi.string().required().min(1).max(100),
  storage_place: Joi.string().optional().allow(null, ''),
  room: Joi.string().optional(),
  is_frequently_used: Joi.boolean().optional().default(false)
});

const updateItemSchema = Joi.object({
  item_name: Joi.string().optional().min(1).max(100),
  storage_place: Joi.string().optional().allow(null, ''),
  room: Joi.string().optional().optional(),
  is_frequently_used: Joi.boolean().optional()
}).min(1);

module.exports = {
  createItemSchema,
  updateItemSchema
};
