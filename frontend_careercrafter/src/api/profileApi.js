import api from './client'

export const getMyProfileApi = () => 
    api.get('/profile/me')

export const updateMyProfileApi = (payload) => 
    api.put('/profile/me', payload)

export const getMyEmployerProfileApi = () => 
    api.get('/profile/employer/me')

export const updateMyEmployerProfileApi = (payload) => 
    api.put('/profile/employer/me', payload)

export const getCandidateProfileApi = (seekerId) => 
    api.get(`/profile/job-seeker/${seekerId}`)