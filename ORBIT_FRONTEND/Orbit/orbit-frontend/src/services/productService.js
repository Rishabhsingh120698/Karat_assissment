import { apiRequest } from './api'

async function getAllProducts() {

  return apiRequest(
    '/api/products'
  )
}

async function getProductById(productId) {

  return apiRequest(
    `/api/products/${productId}`
  )
}

async function createProduct(productRequest) {

  return apiRequest(
    '/api/products',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productRequest)
    }
  )
}

async function updateProduct(
  productId,
  productRequest
) {

  return apiRequest(
    `/api/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productRequest)
    }
  )
}

async function activateProduct(productId) {

  return apiRequest(
    `/api/products/${productId}/activate`,
    {
      method: 'PATCH'
    }
  )
}

async function deactivateProduct(productId) {

  return apiRequest(
    `/api/products/${productId}/deactivate`,
    {
      method: 'PATCH'
    }
  )
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct
}