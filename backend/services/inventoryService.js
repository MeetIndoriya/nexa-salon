import api from './api'

export const getAllInventory = async () => {
    const response = await api.get('/api/inventory')
    return response.data.data
}

export const getInventoryLowStock = async () => {
    const response = await api.get('/api/inventory/loq-stock')
    return response.data.data
}

export const getInventoryCategories = async () => {
    const response = await api.get('/api/inventory/categories')
    return response.data.data
}

export const getInventoryById = async (id) => {
    const response = await api.get(`/api/inventory/${id}`)
    return response.data.data
}

export const createInventory = async (data) => {
    const response = await api.post(`/api/inventory`, data)
    return response.data
}

export const updateInventory = async (id, data) => {
    const response = await api.put(`/api/inventory/${id}`, data)
    return response.data
}

export const updateInventoryRestock = async (id, data) => {
    const response = await api.put(`/api/inventory/${id}/restock`, data)
    return response.data
}

export const deleteInventory = async (id) => {
    const response = await api.delete(`/api/inventory/${id}`)
    return response.data
}
