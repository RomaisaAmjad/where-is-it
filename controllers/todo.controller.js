const todoService = require('../services/todo.service');
const asyncHandler = require('../middlewares/asyn-handler.middleware');

exports.create = asyncHandler(async (req, res) => {
  const todo = await todoService.createTodo(req.body);
  res.status(201).json({ success: true, data: todo });
});

exports.getAll = asyncHandler(async (req, res) => {
  const todos = await todoService.getTodos();
  res.status(200).json({ success: true, data: todos });
});

exports.getOne = asyncHandler(async (req, res) => {
  const todo = await todoService.getTodoById(req.params.id);
  res.status(200).json({ success: true, data: todo });
});

exports.update = asyncHandler(async (req, res) => {
  const todo = await todoService.updateTodo(req.params.id, req.body);
  res.status(200).json({ success: true, data: todo });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await todoService.deleteTodo(req.params.id);
  res.status(200).json({ success: true, data: result });
});