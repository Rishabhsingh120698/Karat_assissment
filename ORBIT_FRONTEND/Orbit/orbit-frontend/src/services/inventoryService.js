import { apiRequest } from './api'

async function getAllInventory() {

  return apiRequest(
    '/api/inventory'
  )
}


async function getInventoryByProductId(
  productId
) {

  return apiRequest(
    `/api/inventory/${productId}`
  )
}


async function createInventory(
  productId,
  stockQuantity
) {

  return apiRequest(
    '/api/inventory',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        productId: Number(productId),
        stockQuantity: Number(stockQuantity)
      })
    }
  )
}


async function increaseStock(
  productId,
  quantity
) {

  return apiRequest(
    `/api/inventory/${productId}/increase`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        quantity: Number(quantity)
      })
    }
  )
}


async function decreaseStock(
  productId,
  quantity
) {

  return apiRequest(
    `/api/inventory/${productId}/decrease`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        quantity: Number(quantity)
      })
    }
  )
}


export {
  getAllInventory,
  getInventoryByProductId,
  createInventory,
  increaseStock,
  decreaseStock
}