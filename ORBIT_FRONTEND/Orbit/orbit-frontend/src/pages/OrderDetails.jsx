import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  getOrderById,
  cancelOrder
} from '../services/orderService'

function OrderDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [order, setOrder] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [cancelling, setCancelling] =
    useState(false)

  const loadOrder = async () => {

    try {

      setLoading(true)

      setError('')

      const data =
        await getOrderById(id)

      setOrder(data)

    } catch (error) {

      console.error(
        'Failed to load order:',
        error
      )

      setError(
        error.message ||
        'Failed to load order.'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    loadOrder()

  }, [id])

  const handleCancelOrder = async () => {

    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this order?'
      )

    if (!confirmed) {
      return
    }

    try {

      setCancelling(true)

      setError('')

      const updatedOrder =
        await cancelOrder(id)

      setOrder(updatedOrder)

    } catch (error) {

      console.error(
        'Failed to cancel order:',
        error
      )

      setError(
        error.message ||
        'Failed to cancel order.'
      )

    } finally {

      setCancelling(false)

    }
  }

  const getStatusClass = (status) => {

    switch (status) {

      case 'CREATED':
        return 'status-created'

      case 'CONFIRMED':
        return 'status-confirmed'

      case 'PROCESSING':
        return 'status-processing'

      case 'SHIPPED':
        return 'status-shipped'

      case 'DELIVERED':
        return 'status-delivered'

      case 'CANCELLED':
        return 'status-cancelled'

      default:
        return 'status-default'
    }
  }

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return 'N/A'
    }

    const date =
      new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleString(
      'en-IN',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    )
  }

  if (loading) {

    return (
      <main className="page-container">

        <div className="order-details-loading">

          <div className="loading-spinner" />

          <p>
            Loading order details...
          </p>

        </div>

      </main>
    )
  }

  if (error && !order) {

    return (
      <main className="page-container">

        <div className="order-details-error">

          <div className="order-error-icon">
            !
          </div>

          <h1>
            Unable to Load Order
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/orders"
            className="primary-button"
          >
            Back to My Orders
          </Link>

        </div>

      </main>
    )
  }

  if (!order) {

    return (
      <main className="page-container">

        <div className="order-details-error">

          <h1>
            Order Not Found
          </h1>

          <p>
            We couldn't find the requested order.
          </p>

          <Link
            to="/orders"
            className="primary-button"
          >
            Back to My Orders
          </Link>

        </div>

      </main>
    )
  }

  const canCancel =
    order.status === 'CREATED' ||
    order.status === 'CONFIRMED'

  return (
    <main className="page-container">

      <div className="order-details-header">

        <div>

          <span className="order-label">
            ORDER DETAILS
          </span>

          <h1 className="page-title">
            #{order.orderNumber}
          </h1>

          <p className="page-subtitle">
            Order ID: #{order.id}
          </p>

        </div>

        <span
          className={
            `status-badge ${
              getStatusClass(
                order.status
              )
            }`
          }
        >
          {order.status}
        </span>

      </div>

      {error && (
        <div className="order-action-error">
          {error}
        </div>
      )}

      <div className="order-details-layout">

        <section>

          <div className="order-details-card">

            <div className="order-details-card-header">

              <h2>
                Order Information
              </h2>

            </div>

            <div className="order-details-info-grid">

              <div className="order-detail-info-item">

                <span>
                  Order Number
                </span>

                <strong>
                  #{order.orderNumber}
                </strong>

              </div>

              <div className="order-detail-info-item">

                <span>
                  Order ID
                </span>

                <strong>
                  #{order.id}
                </strong>

              </div>

              <div className="order-detail-info-item">

                <span>
                  Status
                </span>

                <strong
                  className="order-status-text"
                >
                  {order.status}
                </strong>

              </div>

              <div className="order-detail-info-item">

                <span>
                  Created
                </span>

                <strong>
                  {formatDate(
                    order.createdAt
                  )}
                </strong>

              </div>

              <div className="order-detail-info-item">

                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    order.updatedAt
                  )}
                </strong>

              </div>

            </div>

          </div>

          <div className="order-details-card">

            <div className="order-details-card-header">

              <div>

                <h2>
                  Order Items
                </h2>

                <p>
                  {order.items
                    ? order.items.length
                    : 0}{' '}
                  {order.items &&
                  order.items.length === 1
                    ? 'product'
                    : 'products'}
                </p>

              </div>

            </div>

            <div className="order-items-list">

              {order.items &&
                order.items.map(item => {

                  return (
                    <article
                      className="order-detail-item"
                      key={item.id}
                    >

                      <div className="order-detail-item-icon">
                        📦
                      </div>

                      <div className="order-detail-item-info">

                        <span>
                          Product ID
                        </span>

                        <h3>
                          #{item.productId}
                        </h3>

                      </div>

                      <div className="order-detail-item-value">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {item.quantity}
                        </strong>

                      </div>

                      <div className="order-detail-item-value">

                        <span>
                          Unit Price
                        </span>

                        <strong>
                          ₹{Number(
                            item.price
                          ).toFixed(2)}
                        </strong>

                      </div>

                      <div className="order-detail-item-value order-item-subtotal">

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹{Number(
                            item.subtotal
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </article>
                  )
                })}

            </div>

          </div>

        </section>

        <aside>

          <div className="order-total-card">

            <h2>
              Order Total
            </h2>

            <div className="order-total-line">

              <span>
                Items
              </span>

              <span>
                {order.items
                  ? order.items.length
                  : 0}
              </span>

            </div>

            <div className="order-total-divider" />

            <div className="order-total-final">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{Number(
                  order.totalAmount
                ).toFixed(2)}
              </strong>

            </div>

          </div>

          {canCancel && (

            <div className="cancel-order-card">

              <h2>
                Cancel Order
              </h2>

              <p>
                You can cancel this order
                while it is still in the
                CREATED or CONFIRMED state.
              </p>

              <button
                className="cancel-order-button"
                onClick={
                  handleCancelOrder
                }
                disabled={cancelling}
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </button>

            </div>

          )}

          {!canCancel && (
            <div className="order-status-card">

              <div className="order-status-card-icon">
                ✓
              </div>

              <h2>
                Order Status
              </h2>

              <p>
                This order is currently
                <strong>
                  {' '}{order.status}
                </strong>.
              </p>

              <p>
                Cancellation is not available
                for this order status.
              </p>

            </div>
          )}

          <button
            className="back-orders-button"
            onClick={() =>
              navigate('/orders')
            }
          >
            ← Back to My Orders
          </button>

        </aside>

      </div>

    </main>
  )
}

export default OrderDetails