import api from './api.js';

export const getMenuItems = async (params) => {
	const response = await api.get('/api/menu', { params });
	const payload = response.data?.data ?? response.data;
	return Array.isArray(payload) ? payload : payload?.items || [];
};
export const getMenuItemById = (id) => api.get(`/api/menu/${id}`);
export const createMenuItem = (data) => api.post('/api/menu', data);
export const updateMenuItem = (id, data) => api.put(`/api/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/api/menu/${id}`);
