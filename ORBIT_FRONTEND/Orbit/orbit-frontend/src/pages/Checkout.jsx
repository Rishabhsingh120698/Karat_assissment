import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CartContext from '../contexts/CartContext'
import { createOrder } from '../services/orderService'

function Checkout() {

  const {
    cartItems,
    setCartItems
  } = useContext(CartContext)

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const totalAmount = cartItems.reduce(
    (total, item) => {
      return total + (
        item.price * item.quantity
      )
    },
    0
  )

  const totalQuantity = cartItems.reduce(
    (total, item) => {
      return total + item.quantity
    },
    0
  )

  const handlePlaceOrder = async () => {

    if (cartItems.length === 0) {

      setError(
        'Your cart is empty.'
      )

      return
    }

    try {

      setLoading(true)

      setError('')

      const orderRequest = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }

      console.log(
        'Creating order:',
        orderRequest
      )

      const response =
        await createOrder(orderRequest)

      console.log(
        'Order created successfully:',
        response
      )

      setCartItems([])

      navigate(
        `/orders/${response.id}`
      )

    } catch (error) {

      console.error(
        'Failed to place order:',
        error
      )

      setError(
        error.message ||
        'Failed to place order.'
      )

    } finally {

      setLoading(false)

    }
  }

  if (cartItems.length === 0) {

    return (
      <main className="page-container">

        <div className="checkout-empty">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1 className="page-title">
            Nothing to Checkout
          </h1>

          <p className="page-subtitle">
            Your cart is currently empty.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    )
  }

  return (
    <main className="page-container">

      <div className="checkout-header">

        <div>

          <h1 className="page-title">
            Checkout
          </h1>

          <p className="page-subtitle">
            Review your order before placing it.
          </p>

        </div>

        <div className="checkout-step">

          <span>
            STEP 1
          </span>

          <strong>
            Review Order
          </strong>

        </div>

      </div>

      <div className="checkout-layout">

        <section className="checkout-items-card">

          <div className="checkout-card-header">

            <div>

              <h2>
                Order Items
              </h2>

              <p>
                {cartItems.length}{' '}
                {cartItems.length === 1
                  ? 'product'
                  : 'products'}
                {' · '}
                {totalQuantity}{' '}
                {totalQuantity === 1
                  ? 'item'
                  : 'items'}
              </p>

            </div>

          </div>

          <div className="checkout-items">

            {cartItems.map(item => {

              const subtotal =
                item.price * item.quantity

              return (
                <article
                  className="checkout-item"
                  key={item.productId}
                >

                  <div className="checkout-item-number">
                    {item.quantity}
                  </div>

                  <div className="checkout-item-info">

                    <span className="product-category">
                      PRODUCT
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹{Number(item.price).toFixed(2)}
                      {' '}per unit
                    </p>

                  </div>

                  <div className="checkout-item-quantity">

                    <span>
                      Qty
                    </span>

                    <strong>
                      {item.quantity}
                    </strong>

                  </div>

                  <div className="checkout-item-subtotal">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹{subtotal.toFixed(2)}
                    </strong>

                  </div>

                </article>
              )
            })}

          </div>

        </section>

        <aside className="checkout-summary-card">

          <h2>
            Order Summary
          </h2>

          <div className="checkout-summary-row">

            <span>
              Products
            </span>

            <strong>
              {cartItems.length}
            </strong>

          </div>

          <div className="checkout-summary-row">

            <span>
              Total Quantity
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-total-row">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>

          </div>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading
              ? 'Placing Order...'
              : 'Place Order'}
          </button>

          <button
            className="back-to-cart-button"
            onClick={() =>
              navigate('/cart')
            }
            disabled={loading}
          >
            Back to Cart
          </button>

          <p className="checkout-note">
            Your order will be processed securely
            through Project Orbit's backend services.
          </p>

        </aside>

      </div>

    </main>
  )
}

export default Checkout