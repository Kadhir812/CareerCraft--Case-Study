import api from './client'

export const getNotificationsApi = () => api.get('/notifications')