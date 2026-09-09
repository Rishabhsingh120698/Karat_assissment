import { apiRequest } from './api'

async function getAllProducts() {
  return apiRequest('/api/products')
}

async function getProductById(productId) {
  return apiRequest(`/api/products/${productId}`)
}

export {
  getAllProducts,
  getProductById
}