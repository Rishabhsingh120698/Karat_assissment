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

// ============================================================
// ADMIN OPERATIONS
// ============================================================

async function getAllOrders() {
  return apiRequest('/api/orders/admin')
}

async function updateOrderStatus(
  orderId,
  status
) {
  return apiRequest(
    `/api/orders/${orderId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: status
      })
    }
  )
}

export {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
}