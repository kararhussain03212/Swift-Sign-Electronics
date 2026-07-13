import api from './axios'

export const getFooterLinkGroups = () => api.get('/admin/footer-link-groups')
export const createFooterLinkGroup = (payload) => api.post('/admin/footer-link-groups', payload)
export const updateFooterLinkGroup = (id, payload) => api.put(`/admin/footer-link-groups/${id}`, payload)
export const deleteFooterLinkGroup = (id) => api.delete(`/admin/footer-link-groups/${id}`)
export const reorderFooterLinkGroups = (items) => api.patch('/admin/footer-link-groups/reorder', { items })

export const createFooterLink = (payload) => api.post('/admin/footer-links', payload)
export const updateFooterLink = (id, payload) => api.put(`/admin/footer-links/${id}`, payload)
export const deleteFooterLink = (id) => api.delete(`/admin/footer-links/${id}`)
export const reorderFooterLinks = (items) => api.patch('/admin/footer-links/reorder', { items })
