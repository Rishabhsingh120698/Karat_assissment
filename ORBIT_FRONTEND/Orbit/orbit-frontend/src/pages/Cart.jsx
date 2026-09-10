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
      <main className="page-container">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

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
            Start Shopping
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="page-container">

      <div className="cart-header">

        <div>
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

          {cartItems.map(item => {

            const subtotal =
              item.price * item.quantity

            return (
              <article
                className="cart-item-card"
                key={item.productId}
              >

                <div className="cart-item-info">

                  <span className="product-category">
                    PRODUCT
                  </span>

                  <h2 className="cart-item-name">
                    {item.name}
                  </h2>

                  <p className="cart-item-price">
                    ₹{Number(item.price).toFixed(2)}
                    <span>
                      {' '}per unit
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
                      -
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

                  <p className="cart-item-subtotal">
                    ₹{subtotal.toFixed(2)}
                  </p>

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

          <h2>
            Order Summary
          </h2>

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

          <div className="summary-divider" />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>

          </div>

          <button
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <button
            className="continue-shopping-button"
            onClick={() =>
              navigate('/products')
            }
          >
            Continue Shopping
          </button>

        </aside>

      </div>

    </main>
  )
}

export default Cart