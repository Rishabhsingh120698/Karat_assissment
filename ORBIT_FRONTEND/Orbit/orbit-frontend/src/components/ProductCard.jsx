import { useContext, useState } from 'react'

import CartContext from '../contexts/CartContext'

function ProductCard({ product }) {

  const [quantity, setQuantity] =
    useState(1)

  const {
    addToCart
  } = useContext(CartContext)

  const availableQuantity =
    Number(
      product.availableQuantity || 0
    )

  const increaseQuantity = () => {

    if (
      quantity <
      availableQuantity
    ) {

      setQuantity(
        quantity + 1
      )
    }
  }

  const decreaseQuantity = () => {

    if (quantity > 1) {

      setQuantity(
        quantity - 1
      )
    }
  }

  const handleAddToCart = () => {

    addToCart(
      product,
      quantity
    )

    alert(
      `${product.name} added to cart`
    )
  }

  const isInStock =
    availableQuantity > 0

  return (
    <div className="product-card">

      <div className="product-image-container">

        {product.imageUrl ? (

          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />

        ) : (

          <div
            className="product-image-placeholder"
            aria-label="Product image unavailable"
          >

            <span>
              ORBIT
            </span>

            <strong>
              PRODUCT
            </strong>

          </div>

        )}

        <span className="product-category">
          {product.category}
        </span>

      </div>

      <div className="product-card-content">

        <h2 className="product-name">
          {product.name}
        </h2>

        <p className="product-description">
          {product.description ||
            'Premium quality product from Project Orbit.'}
        </p>

        <div className="product-card-bottom">

          <p className="product-price">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <p
            className={
              isInStock
                ? 'product-stock stock-available'
                : 'product-stock stock-unavailable'
            }
          >

            <span className="stock-dot"></span>

            {isInStock
              ? `${availableQuantity} available`
              : 'Out of Stock'}

          </p>

        </div>

        {isInStock && (

          <div className="product-actions">

            <div className="quantity-controls">

              <button
                className="quantity-button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="quantity-value">
                {quantity}
              </span>

              <button
                className="quantity-button"
                onClick={increaseQuantity}
                disabled={
                  quantity >=
                  availableQuantity
                }
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

            <button
              className="add-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart

              <span>
                →
              </span>

            </button>

          </div>

        )}

        {!isInStock && (

          <button
            className="add-cart-button product-out-of-stock-button"
            disabled
          >
            Currently Unavailable
          </button>

        )}

      </div>

    </div>
  )
}

export default ProductCard