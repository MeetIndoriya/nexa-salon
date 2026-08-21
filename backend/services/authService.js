import api from "./api"

export const loginService = async (data) => {
    const response = await api.post('/api/auth/login', data)
    return response.data
}

export const registerUser = async (data) => {
    const response = await api.post('/api/auth/register', data)
    return response.data
}

export const forgetPassword = async (data) => {
    const response = await api.post('/api/auth/forget-password', data)
    return response.data
}

export const resetPassword = async (data) => {
    const response = await api.post('/api/auth/reset-password', data)
    return response.data
}

export const updateProfile = async (data) => {
    const response = await api.put('/api/auth/profile', data)
    return response.data
}

export const changePassword = async (data) => {
    const response = await api.put('/api/auth/change-password', data)
    return response.data
}

export const getAdminDashboard = async () => {
    const response = await api.get('/api/dashboard/admin')
    return response.data.data
}

export const getCustomerDashboard = async () => {
    const response = await api.get('/api/dashboard/customer')
    return response.data.data
}

export const getBarberDashboard = async () => {
    const response = await api.get('/api/dashboard/barber')
    return response.data.data
}

export const getReceptionistDashboard = async () => {
    const response = await api.get('/api/dashboard/receptionist')
    return response.data.data
}
