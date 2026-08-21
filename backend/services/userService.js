import api from './api'

export const getAllUsers = async (params) => {
    const response = await api.get('/api/users', { params })
    return response.data
}

export const getBarbers = async (params) => {
    const response = await api.get('/api/users/barbers', { params })
    return response.data
}

export const getUserById = async (id) => {
    const response = await api.get(`/api/users/${id}`)
    return response.data
}

export const createUser = async (userData) => {
    const response = await api.post('/api/users', userData)
    return response.data
}

export const updateUser = async (id, data) => {
    const response = await api.put(`/api/users/${id}`, data)
    return response.data
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/api/users/${id}`)
    return response.data
}

export const registerCustomer = async (customerData) => {
    const response = await api.post('/api/auth/register', customerData)
    return response.data
}
