import api from './axios'

export const getNavLinks = () => api.get('/admin/nav-links?paginate=0')
export const createNavLink = (payload) => api.post('/admin/nav-links', payload)
export const updateNavLink = (id, payload) => api.put(`/admin/nav-links/${id}`, payload)
export const deleteNavLink = (id) => api.delete(`/admin/nav-links/${id}`)
export const reorderNavLinks = (items) => api.patch('/admin/nav-links/reorder', { items })
