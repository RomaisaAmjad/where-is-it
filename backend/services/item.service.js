const { Item } = require('../models');
const { NotFoundError } = require('../utils/errors-classes.util');
const { Op } = require('sequelize');

exports.createItem = async (data) => {
  return await Item.create(data);
};

exports.getItems = async (filters = {}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 5;
  const offset = (page - 1) * limit;

  const where = {};

  if (filters.is_frequently_used !== undefined) {
    where.is_frequently_used = filters.is_frequently_used;
  }

  if (filters.search) {
    const searchVal = `%${filters.search}%`;
    where[Op.or] = [
      { item_name: { [Op.iLike]: searchVal } },
      { storage_place: { [Op.iLike]: searchVal } },
      { room: { [Op.iLike]: searchVal } }
    ];
  }

  const { count, rows } = await Item.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  const totalItemsCount = await Item.count();
  const frequentlyUsedCount = await Item.count({ where: { is_frequently_used: true } });
  const uniqueRooms = await Item.findAll({
    attributes: ['room'],
    group: ['room'],
    raw: true
  });
  const roomsLoggedCount = uniqueRooms.filter(r => r.room && r.room.trim() !== '').length;

  return {
    items: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
    stats: {
      totalItems: totalItemsCount,
      frequentlyUsed: frequentlyUsedCount,
      roomsLogged: roomsLoggedCount
    }
  };
};

exports.getItemById = async (id) => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new NotFoundError(`Item with id ${id} not found`);
  }
  return item;
};

exports.updateItem = async (id, data) => {
  const item = await this.getItemById(id);
  return await item.update(data);
};

exports.deleteItem = async (id) => {
  const item = await this.getItemById(id);
  await item.destroy();
  return { message: 'Item deleted successfully' };
};
