import api from './api'

export const getAllAppointment = async () => {
    const response = await api.get('/api/appointments')
    return response.data.data
}

export const getMyAppointment = async () => {
    const response = await api.get('/api/appointments/my')
    return response.data.data
}

export const getMyAppointmentBarber = async () => {
    const response = await api.get('/api/appointments/barber')
    return response.data.data
}

export const getAppointmentAvailableSlot = async (barberId, date) => {
    const response = await api.get('/api/appointments/available-slots', {
        params: { barberId, date }
    })
    return response.data.data
}

export const getAvailableSlots = async (barberId, date) => {
    const response = await api.get('/api/appointments/available-slots', {
        params: { barberId, date }
    })
    return response.data.data
}

export const getAppointmentById = async (id) => {
    const response = await api.get(`/api/appointments/${id}`)
    return response.data.data
}

export const createAppointment = async (appointmentData) => {
    const response = await api.post('/api/appointments', appointmentData)
    return response.data
}

export const cancelAppointment = async (id, reason) => {
    const response = await api.put(`/api/appointments/${id}/cancel`, { reason })
    return response.data
}

export const deleteAppointment = async (id) => {
    const response = await api.delete(`/api/appointments/${id}`)
    return response.data
}

export const updateAppointmentStatus = async (id, status) => {
    const response = await api.put(`/api/appointments/${id}/status`, { status })
    return response.data.data
}


