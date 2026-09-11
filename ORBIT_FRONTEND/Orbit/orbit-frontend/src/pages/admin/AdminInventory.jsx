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

          <div className="admin-page-loading">

            <div className="admin-loading-spinner" />

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

          <div className="admin-page-error">

            <div className="admin-error-icon">
              !
            </div>

            <h2>
              Unable to load inventory
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/admin"
              className="admin-back-link"
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


  const lowStockItems =
    inventory.filter(
      item =>
        Number(item.availableQuantity || 0) > 0 &&
        Number(item.availableQuantity || 0) <= 5
    ).length


  const outOfStockItems =
    inventory.filter(
      item =>
        Number(item.availableQuantity || 0) <= 0
    ).length


  const getStockClass = (availableQuantity) => {

    const available =
      Number(availableQuantity || 0)

    if (available <= 0) {
      return 'inventory-stock-danger'
    }

    if (available <= 5) {
      return 'inventory-stock-warning'
    }

    return 'inventory-stock-good'
  }


  const getStockLabel = (availableQuantity) => {

    const available =
      Number(availableQuantity || 0)

    if (available <= 0) {
      return 'Out of Stock'
    }

    if (available <= 5) {
      return 'Low Stock'
    }

    return 'In Stock'
  }


  return (

    <main className="admin-inventory-page">

      <div className="admin-inventory-container">


        {/* HEADER */}

        <div className="admin-inventory-header">

          <div>

            <Link
              to="/admin"
              className="admin-back-link"
            >
              ← Back to Admin Dashboard
            </Link>

            <span className="admin-inventory-label">
              PROJECT ORBIT • STOCK CONTROL
            </span>

            <h1>
              Inventory Management
            </h1>

            <p>
              Monitor stock levels and manage
              product inventory across the catalog.
            </p>

          </div>

        </div>


        {/* ACTION MESSAGES */}

        {actionError && (

          <div
            className="admin-form-error admin-status-message"
            role="alert"
          >
            <span>!</span>
            {actionError}
          </div>

        )}


        {actionSuccess && (

          <div
            className="admin-form-success admin-status-message"
            role="status"
          >
            <span>✓</span>
            {actionSuccess}
          </div>

        )}


        {/* SUMMARY */}

        <div className="admin-inventory-summary">


          <div className="admin-summary-card">

            <div className="admin-summary-icon">
              ◈
            </div>

            <div>

              <span className="admin-summary-label">
                Products
              </span>

              <strong>
                {inventory.length}
              </strong>

            </div>

          </div>


          <div className="admin-summary-card">

            <div className="admin-summary-icon">
              #
            </div>

            <div>

              <span className="admin-summary-label">
                Total Stock
              </span>

              <strong>
                {totalStock}
              </strong>

            </div>

          </div>


          <div className="admin-summary-card">

            <div className="admin-summary-icon admin-summary-icon-inactive">
              ↔
            </div>

            <div>

              <span className="admin-summary-label">
                Reserved
              </span>

              <strong>
                {totalReserved}
              </strong>

            </div>

          </div>


          <div className="admin-summary-card">

            <div className="admin-summary-icon admin-summary-icon-active">
              ✓
            </div>

            <div>

              <span className="admin-summary-label">
                Available
              </span>

              <strong>
                {totalAvailable}
              </strong>

            </div>

          </div>

        </div>


        {/* STOCK ALERTS */}

        <div className="inventory-alert-row">


          <div className="inventory-alert-card inventory-alert-warning">

            <div className="inventory-alert-icon">
              !
            </div>

            <div>

              <span>
                LOW STOCK
              </span>

              <strong>
                {lowStockItems}
              </strong>

              <p>
                Products need attention
              </p>

            </div>

          </div>


          <div className="inventory-alert-card inventory-alert-danger">

            <div className="inventory-alert-icon">
              ×
            </div>

            <div>

              <span>
                OUT OF STOCK
              </span>

              <strong>
                {outOfStockItems}
              </strong>

              <p>
                Products unavailable
              </p>

            </div>

          </div>


          <div className="inventory-alert-card inventory-alert-neutral">

            <div className="inventory-alert-icon">
              ✓
            </div>

            <div>

              <span>
                AVAILABLE UNITS
              </span>

              <strong>
                {totalAvailable}
              </strong>

              <p>
                Ready for customers
              </p>

            </div>

          </div>

        </div>


        {/* EMPTY STATE */}

        {inventory.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📊
            </div>

            <span className="admin-inventory-label">
              INVENTORY EMPTY
            </span>

            <h2>
              No Inventory Found
            </h2>

            <p>
              There is currently no inventory
              available in the system.
            </p>

          </div>

        ) : (

          <div className="admin-inventory-table-card">


            {/* TABLE HEADER */}

            <div className="admin-table-header">

              <div>

                <span className="admin-inventory-label">
                  STOCK OVERVIEW
                </span>

                <h2>
                  Inventory
                </h2>

                <p>
                  Monitor and manage product stock levels.
                </p>

              </div>

              <div className="admin-table-count">
                {inventory.length} records
              </div>

            </div>


            {/* TABLE */}

            <div className="admin-inventory-table-wrapper">

              <table className="admin-inventory-table">

                <thead>

                  <tr>

                    <th>
                      Inventory
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Total Stock
                    </th>

                    <th>
                      Reserved
                    </th>

                    <th>
                      Available
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {inventory.map(item => (

                    <tr
                      key={item.id}
                    >


                      <td>

                        <span className="inventory-id">
                          #{item.id}
                        </span>

                      </td>


                      <td>

                        <div className="inventory-product-cell">

                          <div className="inventory-product-icon">
                            📦
                          </div>

                          <div>

                            <strong>
                              Product #{item.productId}
                            </strong>

                            <span>
                              Inventory record
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="inventory-number inventory-total">
                          {item.stockQuantity}
                        </span>

                      </td>


                      <td>

                        <span className="inventory-number inventory-reserved">
                          {item.reservedQuantity}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            `inventory-number ${
                              Number(item.availableQuantity || 0) <= 0
                                ? 'inventory-available-danger'
                                : Number(item.availableQuantity || 0) <= 5
                                  ? 'inventory-available-warning'
                                  : 'inventory-available-good'
                            }`
                          }
                        >
                          {item.availableQuantity}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            `inventory-status ${
                              getStockClass(
                                item.availableQuantity
                              )
                            }`
                          }
                        >

                          <span className="inventory-status-dot" />

                          {getStockLabel(
                            item.availableQuantity
                          )}

                        </span>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="inventory-manage-button"
                          onClick={() =>
                            handleOpenManage(
                              item.productId
                            )
                          }
                        >
                          Manage Stock
                          <span>
                            →
                          </span>
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* MANAGE STOCK */}

        {selectedProductId !== null && (

          <div className="admin-inventory-manage-card">


            <div className="admin-inventory-manage-header">

              <div>

                <span className="admin-inventory-label">
                  STOCK MANAGEMENT
                </span>

                <h2>
                  Manage Product #{selectedProductId}
                </h2>

                <p>
                  Increase or decrease the inventory
                  quantity for this product.
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


            <div className="inventory-manage-content">


              <div className="inventory-manage-product">

                <div className="inventory-manage-icon">
                  📦
                </div>

                <div>

                  <span>
                    PRODUCT
                  </span>

                  <strong>
                    #{selectedProductId}
                  </strong>

                </div>

              </div>


              <div className="inventory-manage-form">

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


                <div className="inventory-manage-actions">

                  <button
                    type="button"
                    className="inventory-increase-button"
                    onClick={handleIncreaseStock}
                    disabled={actionLoading}
                  >

                    <span>
                      +
                    </span>

                    {actionLoading
                      ? 'Updating...'
                      : 'Increase Stock'
                    }

                  </button>


                  <button
                    type="button"
                    className="inventory-decrease-button"
                    onClick={handleDecreaseStock}
                    disabled={actionLoading}
                  >

                    <span>
                      −
                    </span>

                    {actionLoading
                      ? 'Updating...'
                      : 'Decrease Stock'
                    }

                  </button>


                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={handleCloseManage}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  )
}

export default AdminInventory