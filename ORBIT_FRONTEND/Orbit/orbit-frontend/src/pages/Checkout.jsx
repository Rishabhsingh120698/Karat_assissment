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
      <main className="checkout-page">

        <div className="checkout-empty">

          <div className="empty-cart-icon">
            🛒
          </div>

          <span className="checkout-page-label">
            PROJECT ORBIT
          </span>

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
            Continue Shopping →
          </Link>

        </div>

      </main>
    )
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-header">

          <div>

            <span className="checkout-page-label">
              PROJECT ORBIT
            </span>

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

                <span className="checkout-card-label">
                  YOUR CART
                </span>

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

              <div className="checkout-item-count">
                {totalQuantity}
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

                    <div className="checkout-item-image">

                      {item.imageUrl ? (

                        <img
                          src={item.imageUrl}
                          alt={item.name}
                        />

                      ) : (

                        <div className="checkout-image-placeholder">
                          ORBIT
                        </div>

                      )}

                    </div>

                    <div className="checkout-item-info">

                      <span className="product-category">
                        PRODUCT
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹{Number(item.price).toLocaleString(
                          'en-IN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
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
                        ₹{subtotal.toLocaleString(
                          'en-IN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </strong>

                    </div>

                  </article>
                )
              })}

            </div>

            <div className="checkout-protection">

              <span>
                🔒
              </span>

              <div>

                <strong>
                  Secure Order Processing
                </strong>

                <p>
                  Your order is submitted securely
                  through Project Orbit services.
                </p>

              </div>

            </div>

          </section>

          <aside className="checkout-summary-card">

            <div className="checkout-summary-heading">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Final Review
              </h2>

            </div>

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

            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong className="checkout-free">
                FREE
              </strong>

            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-total-row">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{totalAmount.toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}
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

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

            <button
              className="back-to-cart-button"
              onClick={() =>
                navigate('/cart')
              }
              disabled={loading}
            >
              ← Back to Cart
            </button>

            <p className="checkout-note">
              Your order will be processed securely
              through Project Orbit's backend services.
            </p>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default Checkout
