import api from './axios'

export const getBlogCategories = () => api.get('/admin/blog-categories?paginate=0')
export const getBlogCategory = (id) => api.get(`/admin/blog-categories/${id}`)
export const createBlogCategory = (payload) => api.post('/admin/blog-categories', payload)
export const updateBlogCategory = (id, payload) => api.put(`/admin/blog-categories/${id}`, payload)
export const deleteBlogCategory = (id) => api.delete(`/admin/blog-categories/${id}`)
