import api from './axios'

export const getCategories = () => api.get('/admin/categories?paginate=0')
export const getCategory = (id) => api.get(`/admin/categories/${id}`)
export const createCategory = (payload) => api.post('/admin/categories', payload)
export const updateCategory = (id, payload) => api.put(`/admin/categories/${id}`, payload)
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`)
