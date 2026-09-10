import { apiRequest } from './api'

async function getMyOrders() {
  return apiRequest('/api/orders')
}

async function getOrderById(orderId) {
  return apiRequest(`/api/orders/${orderId}`)
}

async function createOrder(orderRequest) {
  return apiRequest('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderRequest)
  })
}

async function cancelOrder(orderId) {
  return apiRequest(
    `/api/orders/${orderId}/cancel`,
    {
      method: 'PATCH'
    }
  )
}

export {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder
}