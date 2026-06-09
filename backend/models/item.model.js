'use strict';
const { v7: uuidv7 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    item_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7()
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storage_place: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_frequently_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Item;
};
