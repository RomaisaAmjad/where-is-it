const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const validateRequest = require('../middlewares/validate-request.middleware');
const { createTodoSchema, updateTodoSchema } = require('../schemas/todo.schema');


router.get('/', todoController.getAll);

router.post('/', validateRequest(createTodoSchema), todoController.create);

router.get('/:id', todoController.getOne);

router.put('/:id', validateRequest(updateTodoSchema, "body"), todoController.update);

router.delete('/:id', todoController.remove);

module.exports = router;