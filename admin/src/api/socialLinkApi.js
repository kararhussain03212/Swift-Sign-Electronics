import api from './axios'

export const getSocialLinks = () => api.get('/admin/social-links?paginate=0')
export const createSocialLink = (payload) => api.post('/admin/social-links', payload)
export const updateSocialLink = (id, payload) => api.put(`/admin/social-links/${id}`, payload)
export const deleteSocialLink = (id) => api.delete(`/admin/social-links/${id}`)
export const reorderSocialLinks = (items) => api.patch('/admin/social-links/reorder', { items })
