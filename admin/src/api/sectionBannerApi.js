import api from './axios'

export const getSectionBanners = () => api.get('/admin/section-banners?paginate=0')
export const getSectionBanner = (id) => api.get(`/admin/section-banners/${id}`)
export const createSectionBanner = (payload) => api.post('/admin/section-banners', payload)
export const updateSectionBanner = (id, payload) => api.put(`/admin/section-banners/${id}`, payload)
export const deleteSectionBanner = (id) => api.delete(`/admin/section-banners/${id}`)
