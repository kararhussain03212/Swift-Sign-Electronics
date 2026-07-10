import api from './axios'

export const getOrders = (params = {}) => api.get('/admin/orders', { params })
export const getOrder = (id) => api.get(`/admin/orders/${id}`)
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status })
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`)
