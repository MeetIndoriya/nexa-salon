import api from './api'

export const getAllOrders = async () => {
    const response = await api.get('/api/orders')
    return response.data.data
}

export const getMyOrders = async () => {
    const response = await api.get('/api/orders/my')
    return response.data.data
}

export const createOrder = async (orderData) => {
    const response = await api.post('/api/orders', orderData)
    return response.data
}

export const cancelOrder = async (id, reason) => {
    const response = await api.put(`/api/orders/${id}/cancel`, { reason })
    return response.data
}

export const deleteOrder = async (id) => {
    const response = await api.delete(`/api/orders/${id}`)
    return response.data
}
