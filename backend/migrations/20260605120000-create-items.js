'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items', {
      item_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV7
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storage_place: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      room: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_frequently_used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Items');
  }
};
