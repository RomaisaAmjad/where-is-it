const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const validateRequest = require('../middlewares/validate-request.middleware');
const { createItemSchema, updateItemSchema } = require('../schemas/item.schema');

router.get('/', itemController.getAll);

router.post('/', validateRequest(createItemSchema), itemController.create);

router.get('/:id', itemController.getOne);

router.put('/:id', validateRequest(updateItemSchema, 'body'), itemController.update);

router.delete('/:id', itemController.remove);

module.exports = router;
