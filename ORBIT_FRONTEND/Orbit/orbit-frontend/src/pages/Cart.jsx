import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import CartContext from '../contexts/CartContext'
import AuthContext from '../contexts/AuthContext'

function Cart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useContext(CartContext)

  const {
    isAuthenticated
  } = useContext(AuthContext)

  const navigate = useNavigate()

  const totalAmount = cartItems.reduce(
    (total, item) => {
      return total + (item.price * item.quantity)
    },
    0
  )

  const totalQuantity = cartItems.reduce(
    (total, item) => {
      return total + item.quantity
    },
    0
  )

  const handleCheckout = () => {

    if (!isAuthenticated) {

      navigate('/login')

      return
    }

    navigate('/checkout')
  }

  if (cartItems.length === 0) {

    return (
      <main className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <span className="cart-page-label">
            PROJECT ORBIT
          </span>

          <h1 className="page-title">
            Your Cart is Empty
          </h1>

          <p className="page-subtitle">
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate('/products')
            }
          >
            Start Shopping →
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        <div className="cart-header">

          <div>

            <span className="cart-page-label">
              PROJECT ORBIT
            </span>

            <h1 className="page-title">
              Shopping Cart
            </h1>

            <p className="page-subtitle">
              Review your items before checkout.
            </p>

          </div>

          <div className="cart-summary-badge">

            <span>
              {cartItems.length}
            </span>

            <small>
              {cartItems.length === 1
                ? 'Product'
                : 'Products'}
            </small>

          </div>

        </div>

        <div className="cart-layout">

          <section className="cart-items-section">

            <div className="cart-section-heading">

              <h2>
                Your Items
              </h2>

              <span>
                {totalQuantity} items
              </span>

            </div>

            {cartItems.map(item => {

              const subtotal =
                item.price * item.quantity

              return (
                <article
                  className="cart-item-card"
                  key={item.productId}
                >

                  <div className="cart-item-image">

                    {item.imageUrl ? (

                      <img
                        src={item.imageUrl}
                        alt={item.name}
                      />

                    ) : (

                      <div className="cart-image-placeholder">

                        <span>
                          ORBIT
                        </span>

                        <strong>
                          PRODUCT
                        </strong>

                      </div>

                    )}

                  </div>

                  <div className="cart-item-info">

                    <span className="product-category">
                      PRODUCT
                    </span>

                    <h2 className="cart-item-name">
                      {item.name}
                    </h2>

                    <p className="cart-item-price">
                      ₹{Number(item.price).toLocaleString(
                        'en-IN',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }
                      )}

                      <span>
                        per unit
                      </span>
                    </p>

                  </div>

                  <div className="cart-item-actions">

                    <div className="cart-quantity-control">

                      <button
                        className="quantity-button"
                        onClick={() =>
                          decreaseQuantity(
                            item.productId
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                      >
                        −
                      </button>

                      <span className="cart-quantity">
                        {item.quantity}
                      </span>

                      <button
                        className="quantity-button"
                        onClick={() =>
                          increaseQuantity(
                            item.productId
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <div className="cart-item-total">

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

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(
                          item.productId
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </article>
              )
            })}

          </section>

          <aside className="cart-summary-card">

            <div className="cart-summary-heading">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Your Order
              </h2>

            </div>

            <div className="summary-row">

              <span>
                Products
              </span>

              <span>
                {cartItems.length}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Total Quantity
              </span>

              <span>
                {totalQuantity}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free-delivery">
                FREE
              </span>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>
                Total
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

            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <span>
                →
              </span>
            </button>

            <button
              className="continue-shopping-button"
              onClick={() =>
                navigate('/products')
              }
            >
              ← Continue Shopping
            </button>

            <div className="cart-secure-message">

              <span>
                🔒
              </span>

              <p>
                Secure checkout powered by
                Project Orbit.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default Cart