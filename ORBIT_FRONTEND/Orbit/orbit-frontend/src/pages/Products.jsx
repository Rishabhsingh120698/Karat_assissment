import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getAllProducts
} from '../services/productService'

import {
  getInventoryByProductId
} from '../services/inventoryService'

import ProductCard from '../components/ProductCard'

function Products() {

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {

    loadProducts()

  }, [])

  const loadProducts = async () => {

    try {

      setLoading(true)
      setError('')

      const productData =
        await getAllProducts()

      const productsWithInventory =
        await Promise.all(
          productData.map(
            async product => {

              try {

                const inventory =
                  await getInventoryByProductId(
                    product.id
                  )

                return {
                  ...product,
                  availableQuantity:
                    Number(
                      inventory.availableQuantity || 0
                    )
                }

              } catch (error) {

                console.error(
                  `Failed to load inventory for product ${product.id}:`,
                  error
                )

                return {
                  ...product,
                  availableQuantity: 0
                }
              }
            }
          )
        )

      console.log(
        'Products with inventory:',
        productsWithInventory
      )

      setProducts(
        productsWithInventory
      )

    } catch (error) {

      console.error(
        'Failed to load products:',
        error
      )

      setError(
        error.message ||
        'Failed to load products.'
      )

    } finally {

      setLoading(false)
    }
  }

  if (loading) {

    return (
      <main className="page-container">

        <h1 className="page-title">
          Products
        </h1>

        <p className="loading-message">
          Loading products...
        </p>

      </main>
    )
  }

  if (error) {

    return (
      <main className="page-container">

        <h1 className="page-title">
          Products
        </h1>

        <p className="error-message">
          {error}
        </p>

      </main>
    )
  }

  return (
    <main className="page-container">

      <h1 className="page-title">
        Explore Our Products
      </h1>

      <p className="page-subtitle">
        Discover quality products at great prices.
      </p>

      {products.length === 0 && (

        <p className="loading-message">
          No products available.
        </p>

      )}

      <div className="product-grid">

        {products.map(product => (

          <div key={product.id}>

            <ProductCard
              product={product}
            />

            <Link
              to={`/products/${product.id}`}
              className="details-button"
            >
              View Product Details
            </Link>

          </div>

        ))}

      </div>

    </main>
  )
}

export default Products