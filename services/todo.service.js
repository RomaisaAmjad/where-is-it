const { Todo } = require('../models');
const {NotFoundError} = require('../utils/errors-classes.util');

exports.createTodo = async (data) => {
  return await Todo.create(data);
};

exports.getTodos = async () => {
  return await Todo.findAll();
};

exports.getTodoById = async (id) => {
  const todo = await Todo.findByPk(id);
  if (!todo) {
    throw new NotFoundError(`Todo with id ${id} not found`);
  }
  return todo;
};

exports.updateTodo = async (id, data) => {
  const todo = await this.getTodoById(id); 
  return await todo.update(data);
};

exports.deleteTodo = async (id) => {
  const todo = await this.getTodoById(id); 
  await todo.destroy();
  return { message: 'Todo deleted successfully' };
};