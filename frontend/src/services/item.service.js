import apiClient from './api.client';

const ITEMS_PATH = '/items';

export const getItems = async ({ page, limit, search, is_frequently_used }) => {
  const params = { page, limit };

  if (search) {
    params.search = search;
  }

  if (is_frequently_used) {
    params.is_frequently_used = true;
  }

  const response = await apiClient.get(ITEMS_PATH, { params });
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await apiClient.post(ITEMS_PATH, itemData);
  return response.data;
};

export const updateItem = async (itemId, itemData) => {
  const response = await apiClient.put(`${ITEMS_PATH}/${itemId}`, itemData);
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await apiClient.delete(`${ITEMS_PATH}/${itemId}`);
  return response.data;
};
