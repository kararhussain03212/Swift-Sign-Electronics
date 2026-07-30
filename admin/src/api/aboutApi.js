import api from './axios'

/* ── About Page Settings (singleton) ─────────────────── */
export const getAboutPageSettings = () => api.get('/admin/about-page')
export const updateAboutPageSettings = (payload) => api.put('/admin/about-page', payload)

/* ── Value Cards ("anatomy of excellence") ───────────── */
export const getAboutValueCards = () => api.get('/admin/about-value-cards?paginate=0')
export const getAboutValueCard = (id) => api.get(`/admin/about-value-cards/${id}`)
export const createAboutValueCard = (payload) => api.post('/admin/about-value-cards', payload)
export const updateAboutValueCard = (id, payload) => api.put(`/admin/about-value-cards/${id}`, payload)
export const deleteAboutValueCard = (id) => api.delete(`/admin/about-value-cards/${id}`)
export const reorderAboutValueCards = (items) => api.patch('/admin/about-value-cards/reorder', { items })

/* ── Team Members ────────────────────────────────────── */
export const getAboutTeamMembers = () => api.get('/admin/about-team-members?paginate=0')
export const getAboutTeamMember = (id) => api.get(`/admin/about-team-members/${id}`)
export const createAboutTeamMember = (payload) => api.post('/admin/about-team-members', payload)
export const updateAboutTeamMember = (id, payload) => api.put(`/admin/about-team-members/${id}`, payload)
export const deleteAboutTeamMember = (id) => api.delete(`/admin/about-team-members/${id}`)
export const reorderAboutTeamMembers = (items) => api.patch('/admin/about-team-members/reorder', { items })

/* ── Accolade Cards ("certified excellence") ─────────── */
export const getAboutAccoladeCards = () => api.get('/admin/about-accolade-cards?paginate=0')
export const getAboutAccoladeCard = (id) => api.get(`/admin/about-accolade-cards/${id}`)
export const createAboutAccoladeCard = (payload) => api.post('/admin/about-accolade-cards', payload)
export const updateAboutAccoladeCard = (id, payload) => api.put(`/admin/about-accolade-cards/${id}`, payload)
export const deleteAboutAccoladeCard = (id) => api.delete(`/admin/about-accolade-cards/${id}`)
export const reorderAboutAccoladeCards = (items) => api.patch('/admin/about-accolade-cards/reorder', { items })

/* ── Testimonials ─────────────────────────────────────── */
export const getAboutTestimonials = () => api.get('/admin/about-testimonials?paginate=0')
export const getAboutTestimonial = (id) => api.get(`/admin/about-testimonials/${id}`)
export const createAboutTestimonial = (payload) => api.post('/admin/about-testimonials', payload)
export const updateAboutTestimonial = (id, payload) => api.put(`/admin/about-testimonials/${id}`, payload)
export const deleteAboutTestimonial = (id) => api.delete(`/admin/about-testimonials/${id}`)
export const reorderAboutTestimonials = (items) => api.patch('/admin/about-testimonials/reorder', { items })
