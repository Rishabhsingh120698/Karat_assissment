import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getAllOrders,
  updateOrderStatus
} from '../../services/orderService'

function AdminOrders() {

  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [selectedStatuses, setSelectedStatuses] =
    useState({})

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null)

  const [actionError, setActionError] =
    useState('')

  const [actionSuccess, setActionSuccess] =
    useState('')

  // ============================================================
  // LOAD ALL ORDERS
  // ============================================================

  const loadOrders = async () => {

    try {

      setLoading(true)
      setError('')

      const data =
        await getAllOrders()

      console.log(
        'Admin orders received:',
        data
      )

      setOrders(data)

      // Initialize selected status
      // using the current status of each order.

      const initialStatuses = {}

      data.forEach(order => {

        initialStatuses[order.id] =
          order.status
      })

      setSelectedStatuses(
        initialStatuses
      )

    } catch (error) {

      console.error(
        'Failed to load orders:',
        error
      )

      setError(
        error.message ||
        'Failed to load orders.'
      )

    } finally {

      setLoading(false)
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    loadOrders()

  }, [])

  // ============================================================
  // STATUS CHANGE
  // ============================================================

  const handleStatusChange = (
    orderId,
    status
  ) => {

    setSelectedStatuses(previous => ({
      ...previous,
      [orderId]: status
    }))

    setActionError('')
    setActionSuccess('')
  }

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const handleUpdateStatus = async (
    order
  ) => {

    setActionError('')
    setActionSuccess('')

    const selectedStatus =
      selectedStatuses[order.id]

    if (!selectedStatus) {

      setActionError(
        'Please select an order status.'
      )

      return
    }

    if (
      selectedStatus === order.status
    ) {

      setActionError(
        'Please select a different status.'
      )

      return
    }

    try {

      setUpdatingOrderId(
        order.id
      )

      const updatedOrder =
        await updateOrderStatus(
          order.id,
          selectedStatus
        )

      console.log(
        'Order status updated:',
        updatedOrder
      )

      setOrders(previousOrders =>
        previousOrders.map(
          currentOrder =>
            currentOrder.id === order.id
              ? updatedOrder
              : currentOrder
        )
      )

      setSelectedStatuses(previous => ({
        ...previous,
        [order.id]:
          updatedOrder.status
      }))

      setActionSuccess(
        `Order ${updatedOrder.orderNumber} status updated to ${updatedOrder.status}.`
      )

    } catch (error) {

      console.error(
        'Failed to update order status:',
        error
      )

      setActionError(
        error.message ||
        'Failed to update order status.'
      )

    } finally {

      setUpdatingOrderId(null)
    }
  }

  // ============================================================
  // AVAILABLE STATUS OPTIONS
  // ============================================================

  const getStatusOptions = (
    currentStatus
  ) => {

    switch (currentStatus) {

      case 'CREATED':

        return [
          'CONFIRMED'
        ]

      case 'CONFIRMED':

        return [
          'PROCESSING'
        ]

      case 'PROCESSING':

        return [
          'SHIPPED'
        ]

      case 'SHIPPED':

        return [
          'DELIVERED'
        ]

      case 'DELIVERED':

        return []

      case 'CANCELLED':

        return []

      default:

        return []
    }
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    dateValue
  ) => {

    if (!dateValue) {
      return '-'
    }

    const date =
      new Date(dateValue)

    if (Number.isNaN(
      date.getTime()
    )) {

      return dateValue
    }

    return date.toLocaleString()
  }

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatAmount = (
    amount
  ) => {

    if (
      amount === null ||
      amount === undefined
    ) {

      return '₹0.00'
    }

    return `₹${Number(amount).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`
  }

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (
    status
  ) => {

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
        return ''
    }
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {

    return (
      <main className="admin-orders-page">

        <div className="admin-orders-container">

          <div className="loading-container">

            <div className="loading-spinner" />

            <p>
              Loading orders...
            </p>

          </div>

        </div>

      </main>
    )
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {

    return (
      <main className="admin-orders-page">

        <div className="admin-orders-container">

          <div className="error-container">

            <h2>
              Unable to load orders
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/admin"
              className="back-link"
            >
              ← Back to Admin Dashboard
            </Link>

          </div>

        </div>

      </main>
    )
  }

  // ============================================================
  // SUMMARY VALUES
  // ============================================================

  const totalOrders =
    orders.length

  const confirmedOrders =
    orders.filter(
      order =>
        order.status === 'CONFIRMED'
    ).length

  const processingOrders =
    orders.filter(
      order =>
        order.status === 'PROCESSING'
    ).length

  const completedOrders =
    orders.filter(
      order =>
        order.status === 'DELIVERED'
    ).length

  const cancelledOrders =
    orders.filter(
      order =>
        order.status === 'CANCELLED'
    ).length

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="admin-orders-page">

      <div className="admin-orders-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="admin-orders-header">

          <div>

            <Link
              to="/admin"
              className="back-link"
            >
              ← Back to Admin Dashboard
            </Link>

            <span className="admin-orders-label">
              ADMINISTRATION
            </span>

            <h1>
              Order Management
            </h1>

            <p>
              View customer orders and manage
              their order lifecycle.
            </p>

          </div>

        </div>

        {/* =====================================================
            ACTION ERROR
        ====================================================== */}

        {actionError && (

          <div
            className="admin-form-error"
            role="alert"
          >
            {actionError}
          </div>

        )}

        {/* =====================================================
            ACTION SUCCESS
        ====================================================== */}

        {actionSuccess && (

          <div
            className="admin-form-success"
            role="status"
          >
            {actionSuccess}
          </div>

        )}

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="admin-orders-summary">

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Confirmed
            </span>

            <strong>
              {confirmedOrders}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Processing
            </span>

            <strong>
              {processingOrders}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Delivered
            </span>

            <strong>
              {completedOrders}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Cancelled
            </span>

            <strong>
              {cancelledOrders}
            </strong>

          </div>

        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {orders.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              🛒
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              There are currently no customer
              orders in Project Orbit.
            </p>

          </div>

        ) : (

          /* ===================================================
             ORDER TABLE
          ==================================================== */

          <div className="admin-orders-table-card">

            <div className="admin-table-header">

              <div>

                <h2>
                  Customer Orders
                </h2>

                <p>
                  Monitor orders and update
                  their lifecycle status.
                </p>

              </div>

            </div>

            <div className="admin-orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Items
                    </th>

                    <th>
                      Current Status
                    </th>

                    <th>
                      Created
                    </th>

                    <th>
                      Update Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map(order => {

                    const statusOptions =
                      getStatusOptions(
                        order.status
                      )

                    const selectedStatus =
                      selectedStatuses[
                        order.id
                      ]

                    const isUpdating =
                      updatingOrderId ===
                      order.id

                    return (

                      <tr
                        key={order.id}
                      >

                        {/* ORDER */}

                        <td>

                          <div className="admin-order-number">

                            <Link
                              to={`/orders/${order.id}`}
                            >
                              {order.orderNumber}
                            </Link>

                          </div>

                          <span className="admin-order-id">
                            Order #{order.id}
                          </span>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <span className="admin-customer-id">
                            User #{order.userId}
                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td>

                          <strong className="admin-order-amount">
                            {formatAmount(
                              order.totalAmount
                            )}
                          </strong>

                        </td>

                        {/* ITEMS */}

                        <td>

                          <span className="admin-order-items-count">

                            {order.items
                              ? order.items.length
                              : 0}

                            {' '}
                            {order.items &&
                            order.items.length === 1
                              ? 'item'
                              : 'items'}

                          </span>

                        </td>

                        {/* CURRENT STATUS */}

                        <td>

                          <span
                            className={
                              `admin-order-status ${getStatusClass(
                                order.status
                              )}`
                            }
                          >
                            {order.status}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td>

                          <span className="admin-order-date">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>

                        </td>

                        {/* UPDATE STATUS */}

                        <td>

                          {statusOptions.length === 0 ? (

                            <span className="admin-order-no-action">

                              {order.status ===
                              'DELIVERED'
                                ? 'Completed'
                                : 'No action'}

                            </span>

                          ) : (

                            <div className="admin-order-status-actions">

                              <select
                                value={
                                  selectedStatus ||
                                  order.status
                                }
                                onChange={event =>
                                  handleStatusChange(
                                    order.id,
                                    event.target.value
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="admin-order-status-select"
                              >

                                <option
                                  value={
                                    order.status
                                  }
                                >
                                  {order.status}
                                </option>

                                {statusOptions.map(
                                  status => (

                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {status}
                                    </option>

                                  )
                                )}

                              </select>

                              <button
                                type="button"
                                className="admin-primary-button admin-order-update-button"
                                onClick={() =>
                                  handleUpdateStatus(
                                    order
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  selectedStatus ===
                                    order.status
                                }
                              >

                                {isUpdating
                                  ? 'Updating...'
                                  : 'Update'}

                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    )
                  })}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </main>
  )
}

export default AdminOrders