const itemService = require('../services/item.service');
const asyncHandler = require('../middlewares/asyn-handler.middleware');
const HTTP_STATUS = require('../constants/http-status.constant');

exports.create = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.body);
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: item });
});

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, is_frequently_used, search } = req.query;
  const result = await itemService.getItems({
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    is_frequently_used: is_frequently_used !== undefined ? (is_frequently_used === 'true') : undefined,
    search
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.items,
    pagination: {
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit
    },
    stats: result.stats
  });
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await itemService.getItemById(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({ success: true, data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await itemService.deleteItem(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});
