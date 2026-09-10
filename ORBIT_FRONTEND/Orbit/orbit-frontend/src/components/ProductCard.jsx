import { useContext, useState } from 'react'

import CartContext from '../contexts/CartContext'

function ProductCard({ product }) {

  const [quantity, setQuantity] = useState(1)

  const {
    addToCart
  } = useContext(CartContext)

  const increaseQuantity = () => {

    if (
      quantity <
      product.stockQuantity
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
    product.stockQuantity > 0

  return (
    <div className="product-card">

      <span className="product-category">
        {product.category}
      </span>

      <h2 className="product-name">
        {product.name}
      </h2>

      <p className="product-description">
        {product.description ||
          'Premium quality product from Project Orbit.'}
      </p>

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
        {isInStock
          ? `${product.stockQuantity} available`
          : 'Out of Stock'}
      </p>

      {isInStock && (
        <div className="product-actions">

          <div className="quantity-controls">

            <button
              className="quantity-button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </button>

            <span className="quantity-value">
              {quantity}
            </span>

            <button
              className="quantity-button"
              onClick={increaseQuantity}
              disabled={
                quantity >=
                product.stockQuantity
              }
            >
              +
            </button>

          </div>

          <button
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

        </div>
      )}

    </div>
  )
}

export default ProductCard