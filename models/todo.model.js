'use strict';
const { v7: uuidv7 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    todo_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7()
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Todos',
    timestamps: true
  });
  
  return Todo;
};