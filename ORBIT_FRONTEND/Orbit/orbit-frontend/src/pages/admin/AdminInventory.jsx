import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getAllInventory,
  increaseStock,
  decreaseStock
} from '../../services/inventoryService'

function AdminInventory() {

  const [inventory, setInventory] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [selectedProductId, setSelectedProductId] =
    useState(null)

  const [quantity, setQuantity] =
    useState('')

  const [actionLoading, setActionLoading] =
    useState(false)

  const [actionError, setActionError] =
    useState('')

  const [actionSuccess, setActionSuccess] =
    useState('')

  const loadInventory = async () => {

    try {

      setLoading(true)
      setError('')

      const data =
        await getAllInventory()

      console.log(
        'Admin inventory received:',
        data
      )

      setInventory(data)

    } catch (error) {

      console.error(
        'Failed to load inventory:',
        error
      )

      setError(
        error.message ||
        'Failed to load inventory.'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    loadInventory()

  }, [])

  const handleOpenManage = (productId) => {

    setSelectedProductId(productId)

    setQuantity('')

    setActionError('')
    setActionSuccess('')
  }

  const handleCloseManage = () => {

    if (actionLoading) {
      return
    }

    setSelectedProductId(null)

    setQuantity('')

    setActionError('')
    setActionSuccess('')
  }

  const handleQuantityChange = (event) => {

    setQuantity(
      event.target.value
    )

    setActionError('')
    setActionSuccess('')
  }

  const handleIncreaseStock = async () => {

    setActionError('')
    setActionSuccess('')

    if (
      quantity === '' ||
      Number(quantity) <= 0
    ) {

      setActionError(
        'Please enter a quantity greater than 0.'
      )

      return
    }

    try {

      setActionLoading(true)

      const updatedInventory =
        await increaseStock(
          selectedProductId,
          quantity
        )

      console.log(
        'Stock increased successfully:',
        updatedInventory
      )

      setActionSuccess(
        `Stock increased by ${quantity}.`
      )

      setQuantity('')

      await loadInventory()

    } catch (error) {

      console.error(
        'Failed to increase stock:',
        error
      )

      setActionError(
        error.message ||
        'Failed to increase stock.'
      )

    } finally {

      setActionLoading(false)

    }
  }

  const handleDecreaseStock = async () => {

    setActionError('')
    setActionSuccess('')

    if (
      quantity === '' ||
      Number(quantity) <= 0
    ) {

      setActionError(
        'Please enter a quantity greater than 0.'
      )

      return
    }

    try {

      setActionLoading(true)

      const updatedInventory =
        await decreaseStock(
          selectedProductId,
          quantity
        )

      console.log(
        'Stock decreased successfully:',
        updatedInventory
      )

      setActionSuccess(
        `Stock decreased by ${quantity}.`
      )

      setQuantity('')

      await loadInventory()

    } catch (error) {

      console.error(
        'Failed to decrease stock:',
        error
      )

      setActionError(
        error.message ||
        'Failed to decrease stock.'
      )

    } finally {

      setActionLoading(false)

    }
  }

  if (loading) {

    return (
      <main className="admin-inventory-page">

        <div className="admin-inventory-container">

          <div className="loading-container">

            <div className="loading-spinner" />

            <p>
              Loading inventory...
            </p>

          </div>

        </div>

      </main>
    )
  }

  if (error) {

    return (
      <main className="admin-inventory-page">

        <div className="admin-inventory-container">

          <div className="error-container">

            <h2>
              Unable to load inventory
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

  const totalStock =
    inventory.reduce(
      (total, item) =>
        total +
        Number(item.stockQuantity || 0),
      0
    )

  const totalReserved =
    inventory.reduce(
      (total, item) =>
        total +
        Number(item.reservedQuantity || 0),
      0
    )

  const totalAvailable =
    inventory.reduce(
      (total, item) =>
        total +
        Number(item.availableQuantity || 0),
      0
    )

  return (
    <main className="admin-inventory-page">

      <div className="admin-inventory-container">

        <div className="admin-inventory-header">

          <div>

            <Link
              to="/admin"
              className="back-link"
            >
              ← Back to Admin Dashboard
            </Link>

            <span className="admin-inventory-label">
              ADMINISTRATION
            </span>

            <h1>
              Inventory Management
            </h1>

            <p>
              View and manage stock levels for
              Project Orbit products.
            </p>

          </div>

        </div>

        {actionError && (

          <div
            className="admin-form-error"
            role="alert"
          >
            {actionError}
          </div>

        )}

        {actionSuccess && (

          <div
            className="admin-form-success"
            role="status"
          >
            {actionSuccess}
          </div>

        )}

        <div className="admin-inventory-summary">

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Products
            </span>

            <strong>
              {inventory.length}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Reserved
            </span>

            <strong>
              {totalReserved}
            </strong>

          </div>

          <div className="admin-summary-card">

            <span className="admin-summary-label">
              Available
            </span>

            <strong>
              {totalAvailable}
            </strong>

          </div>

        </div>

        {inventory.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📊
            </div>

            <h2>
              No Inventory Found
            </h2>

            <p>
              There is currently no inventory
              available.
            </p>

          </div>

        ) : (

          <div className="admin-inventory-table-card">

            <div className="admin-table-header">

              <div>

                <h2>
                  Inventory
                </h2>

                <p>
                  Monitor and manage product stock.
                </p>

              </div>

            </div>

            <div className="admin-inventory-table-wrapper">

              <table className="admin-inventory-table">

                <thead>

                  <tr>

                    <th>
                      Inventory ID
                    </th>

                    <th>
                      Product ID
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Reserved
                    </th>

                    <th>
                      Available
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {inventory.map(item => (

                    <tr
                      key={item.id}
                    >

                      <td>
                        #{item.id}
                      </td>

                      <td>
                        Product #{item.productId}
                      </td>

                      <td>
                        {item.stockQuantity}
                      </td>

                      <td>
                        {item.reservedQuantity}
                      </td>

                      <td>
                        {item.availableQuantity}
                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-action-button"
                          onClick={() =>
                            handleOpenManage(
                              item.productId
                            )
                          }
                        >
                          Manage Stock
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {selectedProductId !== null && (

          <div className="admin-inventory-manage-card">

            <div className="admin-inventory-manage-header">

              <div>

                <span className="admin-inventory-label">
                  STOCK MANAGEMENT
                </span>

                <h2>
                  Manage Product #
                  {selectedProductId}
                </h2>

                <p>
                  Increase or decrease the
                  available product stock.
                </p>

              </div>

              <button
                type="button"
                className="admin-form-close-button"
                onClick={handleCloseManage}
                disabled={actionLoading}
              >
                ×
              </button>

            </div>

            <div className="admin-inventory-manage-form">

              <div className="admin-form-field">

                <label htmlFor="stock-quantity">
                  Quantity
                </label>

                <input
                  id="stock-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                  disabled={actionLoading}
                />

              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={handleCloseManage}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={handleIncreaseStock}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Updating...'
                    : 'Increase Stock'
                  }
                </button>

                <button
                  type="button"
                  className="admin-action-button admin-danger-action"
                  onClick={handleDecreaseStock}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Updating...'
                    : 'Decrease Stock'
                  }
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  )
}

export default AdminInventory