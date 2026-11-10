import api from './api.js';

export const createOrder = (data) => api.post('/api/orders', data);
export const getOrders = (params) => api.get('/api/orders', { params });
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/api/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/api/orders/stats');
