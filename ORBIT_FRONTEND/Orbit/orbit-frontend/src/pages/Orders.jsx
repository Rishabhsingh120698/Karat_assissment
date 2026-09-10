import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getMyOrders } from '../services/orderService'

function Orders() {

  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {

    getMyOrders()
      .then(data => {

        setOrders(data)

        setLoading(false)

      })
      .catch(error => {

        console.error(
          'Failed to load orders:',
          error
        )

        setError(
          error.message ||
          'Failed to load orders.'
        )

        setLoading(false)

      })

  }, [])

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

        <div className="orders-page-header">

          <div>
            <h1 className="page-title">
              My Orders
            </h1>

            <p className="page-subtitle">
              View and manage your orders.
            </p>
          </div>

        </div>

        <div className="loading-card">
          <div className="loading-spinner" />
          <p>
            Loading your orders...
          </p>
        </div>

      </main>
    )
  }

  if (error) {

    return (
      <main className="page-container">

        <div className="orders-page-header">

          <div>
            <h1 className="page-title">
              My Orders
            </h1>

            <p className="page-subtitle">
              View and manage your orders.
            </p>
          </div>

        </div>

        <div className="orders-error-card">

          <div className="orders-error-icon">
            !
          </div>

          <h2>
            Unable to Load Orders
          </h2>

          <p>
            {error}
          </p>

        </div>

      </main>
    )
  }

  return (
    <main className="page-container">

      <div className="orders-page-header">

        <div>

          <h1 className="page-title">
            My Orders
          </h1>

          <p className="page-subtitle">
            View and manage your orders.
          </p>

        </div>

        <div className="orders-count">

          <strong>
            {orders.length}
          </strong>

          <span>
            {orders.length === 1
              ? 'Order'
              : 'Orders'}
          </span>

        </div>

      </div>

      {orders.length === 0 && (

        <div className="empty-orders-card">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Start Shopping
          </Link>

        </div>

      )}

      {orders.length > 0 && (

        <div className="orders-grid">

          {orders.map(order => (

            <article
              className="order-card"
              key={order.id}
            >

              <div className="order-card-header">

                <div>

                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order.orderNumber}
                  </h2>

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

              <div className="order-card-divider" />

              <div className="order-info-grid">

                <div className="order-info-item">

                  <span>
                    Order ID
                  </span>

                  <strong>
                    #{order.id}
                  </strong>

                </div>

                <div className="order-info-item">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{Number(
                      order.totalAmount
                    ).toFixed(2)}
                  </strong>

                </div>

                <div className="order-info-item">

                  <span>
                    Created
                  </span>

                  <strong>
                    {formatDate(
                      order.createdAt
                    )}
                  </strong>

                </div>

              </div>

              <div className="order-card-footer">

                <Link
                  to={`/orders/${order.id}`}
                  className="view-order-button"
                >
                  View Order Details
                  <span>
                    →
                  </span>
                </Link>

              </div>

            </article>

          ))}

        </div>

      )}

    </main>
  )
}

export default Orders