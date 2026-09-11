import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProductById } from '../services/productService'
import {
  getInventoryByProductId
} from '../services/inventoryService'

function ProductDetails() {

  const { id } = useParams()

  const [product, setProduct] =
    useState(null)

  const [inventory, setInventory] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {

    async function loadProductDetails() {

      try {

        setLoading(true)
        setError('')

        const productData =
          await getProductById(id)

        const inventoryData =
          await getInventoryByProductId(id)

        console.log(
          'Inventory data received:',
          inventoryData
        )

        setProduct(productData)

        setInventory(inventoryData)

      } catch (error) {

        console.error(
          'Failed to load product details:',
          error
        )

        setError(
          error.message ||
          'Failed to load product details.'
        )

      } finally {

        setLoading(false)

      }
    }

    loadProductDetails()

  }, [id])

  if (loading) {

    return (
      <main className="product-details-page">

        <div className="product-details-container">

          <div className="loading-container">

            <div className="loading-spinner" />

            <p>
              Loading product details...
            </p>

          </div>

        </div>

      </main>
    )
  }

  if (error) {

    return (
      <main className="product-details-page">

        <div className="product-details-container">

          <div className="error-container">

            <h2>
              Unable to load product
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/products"
              className="back-link"
            >
              ← Back to Products
            </Link>

          </div>

        </div>

      </main>
    )
  }

  if (!product) {

    return (
      <main className="product-details-page">

        <div className="product-details-container">

          <div className="error-container">

            <h2>
              Product not found
            </h2>

            <Link
              to="/products"
              className="back-link"
            >
              ← Back to Products
            </Link>

          </div>

        </div>

      </main>
    )
  }

  const availableStock =
    inventory
      ? Number(inventory.availableQuantity || 0)
      : null

  const isInStock =
    availableStock !== null &&
    availableStock > 0

  return (
    <main className="product-details-page">

      <div className="product-details-container">

        <div className="product-details-header">

          <Link
            to="/products"
            className="back-link"
          >
            ← Back to Products
          </Link>

          <span className="product-details-label">
            PRODUCT DETAILS
          </span>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-subtitle">
            Explore the product information
            and current inventory availability.
          </p>

        </div>

        <div className="product-details-card">

          <div className="product-details-image-section">

            {product.imageUrl ? (

              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-details-image"
              />

            ) : (

              <div className="product-details-image-placeholder">

                <span>
                  PROJECT ORBIT
                </span>

                <strong>
                  PRODUCT
                </strong>

              </div>

            )}

          </div>

          <div className="product-details-content">

            <div className="product-details-info">

              <span className="product-category">
                {product.category}
              </span>

              <h2>
                {product.name}
              </h2>

              <p className="product-description">
                {product.description ||
                  'Premium quality product from Project Orbit.'}
              </p>

              <div className="product-details-price">

                ₹{Number(product.price).toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}

              </div>

              <div className="product-details-stock-card">

                <span
                  className={
                    isInStock
                      ? 'product-details-stock-dot stock-available'
                      : 'product-details-stock-dot stock-unavailable'
                  }
                />

                <div>

                  <strong>
                    {inventory
                      ? isInStock
                        ? 'In Stock'
                        : 'Out of Stock'
                      : 'Stock Unavailable'
                    }
                  </strong>

                  <span>
                    {inventory
                      ? isInStock
                        ? `${availableStock} units available`
                        : 'This product is currently unavailable.'
                      : 'Inventory information could not be loaded.'
                    }
                  </span>

                </div>

              </div>

              <div className="product-details-grid">

                <div className="product-detail-item">

                  <span className="product-detail-label">
                    Product ID
                  </span>

                  <span className="product-detail-value">
                    #{product.id}
                  </span>

                </div>

                <div className="product-detail-item">

                  <span className="product-detail-label">
                    Available Stock
                  </span>

                  <span className="product-detail-value">
                    {inventory
                      ? availableStock
                      : 'Unavailable'
                    }
                  </span>

                </div>

                <div className="product-detail-item">

                  <span className="product-detail-label">
                    Product Status
                  </span>

                  <span
                    className={
                      product.active
                        ? 'status-active'
                        : 'status-inactive'
                    }
                  >
                    {product.active
                      ? 'Active'
                      : 'Inactive'
                    }
                  </span>

                </div>

              </div>

              <div className="product-details-actions">

                <Link
                  to="/products"
                  className="product-details-back-button"
                >
                  ← Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}

export default ProductDetails
