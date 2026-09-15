import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getAllProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct
} from '../../services/productService'

import {
  createInventory
} from '../../services/inventoryService'


function AdminProducts() {

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [showProductForm, setShowProductForm] =
    useState(false)

  const [editingProductId, setEditingProductId] =
    useState(null)

  const [formLoading, setFormLoading] =
    useState(false)

  const [formError, setFormError] =
    useState('')

  const [formSuccess, setFormSuccess] =
    useState('')

  const [statusLoadingId, setStatusLoadingId] =
    useState(null)

  const [statusError, setStatusError] =
    useState('')

  const [statusSuccess, setStatusSuccess] =
    useState('')

  const [formData, setFormData] =
    useState({
      name: '',
      description: '',
      price: '',
      category: '',
      stockQuantity: '',
      imageUrl: '',
      active: true
    })


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {

    try {

      setLoading(true)
      setError('')

      const data =
        await getAllProducts()

      console.log(
        'Admin products received:',
        data
      )


      // =====================================================
      // SORT PRODUCTS BY ID
      // =====================================================
      //
      // Backend may return:
      //
      // 2
      // 4
      // 1
      // 3
      // 5
      //
      // We want:
      //
      // 1
      // 2
      // 3
      // 4
      // 5
      //
      // [...data] creates a copy so that
      // we don't modify the original API response.
      // =====================================================

      const sortedProducts =
        Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                Number(a.id) -
                Number(b.id)
            )
          : []


      console.log(
        'Sorted products:',
        sortedProducts
      )


      setProducts(
        sortedProducts
      )

    } catch (error) {

      console.error(
        'Failed to load admin products:',
        error
      )

      setError(
        error.message ||
        'Failed to load products.'
      )

    } finally {

      setLoading(false)

    }

  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadProducts()

  }, [])


  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleInputChange = (event) => {

    const {
      name,
      value,
      type,
      checked
    } = event.target

    setFormData(
      currentData => ({
        ...currentData,

        [name]:
          type === 'checkbox'
            ? checked
            : value
      })
    )

  }


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stockQuantity: '',
      imageUrl: '',
      active: true
    })

    setEditingProductId(null)

    setFormError('')
    setFormSuccess('')

  }


  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const handleOpenAddForm = () => {

    resetForm()

    setShowProductForm(true)

  }


  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const handleOpenEditForm = (product) => {

    setFormError('')
    setFormSuccess('')

    setEditingProductId(
      product.id
    )

    setFormData({

      name:
        product.name || '',

      description:
        product.description || '',

      price:
        product.price ?? '',

      category:
        product.category || '',

      stockQuantity:
        product.stockQuantity ?? '',

      imageUrl:
        product.imageUrl || '',

      active:
        product.active ?? true

    })

    setShowProductForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseProductForm = () => {

    if (formLoading) {
      return
    }

    setShowProductForm(false)

    resetForm()

  }


  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {

    if (
      formData.name.trim() === ''
    ) {

      setFormError(
        'Product name is required.'
      )

      return false
    }


    if (
      formData.description.trim() === ''
    ) {

      setFormError(
        'Product description is required.'
      )

      return false
    }


    if (
      formData.price === '' ||
      Number(formData.price) <= 0
    ) {

      setFormError(
        'Price must be greater than 0.'
      )

      return false
    }


    if (
      formData.category.trim() === ''
    ) {

      setFormError(
        'Category is required.'
      )

      return false
    }


    if (
      formData.stockQuantity === '' ||
      Number(formData.stockQuantity) < 0
    ) {

      setFormError(
        'Stock quantity cannot be negative.'
      )

      return false
    }


    return true

  }


  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  const handleProductSubmit = async (event) => {

    event.preventDefault()

    setFormError('')
    setFormSuccess('')


    const isValid =
      validateForm()

    if (!isValid) {
      return
    }


    const productRequest = {

      name:
        formData.name.trim(),

      description:
        formData.description.trim(),

      price:
        Number(formData.price),

      category:
        formData.category.trim(),

      stockQuantity:
        Number(formData.stockQuantity),

      imageUrl:
        formData.imageUrl.trim(),

      active:
        formData.active

    }


    try {

      setFormLoading(true)


      // =====================================================
      // EDIT EXISTING PRODUCT
      // =====================================================

      if (
        editingProductId !== null
      ) {

        const updatedProduct =
          await updateProduct(
            editingProductId,
            productRequest
          )

        console.log(
          'Product updated successfully:',
          updatedProduct
        )

        setFormSuccess(
          'Product updated successfully.'
        )

      }


      // =====================================================
      // CREATE NEW PRODUCT
      // =====================================================

      else {

        const createdProduct =
          await createProduct(
            productRequest
          )

        console.log(
          'Product created successfully:',
          createdProduct
        )


        // Create matching inventory

        const createdInventory =
          await createInventory(
            createdProduct.id,
            productRequest.stockQuantity
          )

        console.log(
          'Inventory created successfully:',
          createdInventory
        )


        setFormSuccess(
          'Product and inventory created successfully.'
        )

      }


      // =====================================================
      // RELOAD PRODUCTS
      // =====================================================
      //
      // loadProducts() now automatically sorts by ID.
      //
      // So after adding/editing/deactivating:
      //
      // 1
      // 2
      // 3
      // 4
      // ...
      //
      // will remain the order.
      // =====================================================

      await loadProducts()


      setTimeout(() => {

        setShowProductForm(false)

        resetForm()

      }, 1000)


    } catch (error) {

      console.error(
        'Failed to save product:',
        error
      )

      setFormError(
        error.message ||
        'Failed to save product.'
      )

    } finally {

      setFormLoading(false)

    }

  }


  // =========================================================
  // ACTIVATE / DEACTIVATE
  // =========================================================

  const handleToggleProductStatus =
    async (product) => {

      setStatusError('')
      setStatusSuccess('')


      try {

        setStatusLoadingId(
          product.id
        )


        let updatedProduct


        if (product.active) {

          updatedProduct =
            await deactivateProduct(
              product.id
            )

          console.log(
            'Product deactivated successfully:',
            updatedProduct
          )

          setStatusSuccess(
            `${product.name} deactivated successfully.`
          )

        }


        else {

          updatedProduct =
            await activateProduct(
              product.id
            )

          console.log(
            'Product activated successfully:',
            updatedProduct
          )

          setStatusSuccess(
            `${product.name} activated successfully.`
          )

        }


        // Reload sorted list

        await loadProducts()


      } catch (error) {

        console.error(
          'Failed to change product status:',
          error
        )

        setStatusError(
          error.message ||
          'Failed to change product status.'
        )

      } finally {

        setStatusLoadingId(null)

      }

    }


  // =========================================================
  // SUMMARY
  // =========================================================

  const activeProducts =
    products.filter(
      product =>
        product.active === true
    ).length


  const inactiveProducts =
    products.filter(
      product =>
        product.active === false
    ).length


  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.stockQuantity || 0
        ),
      0
    )


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <main className="admin-products-page">

        <div className="admin-products-container">

          <div className="admin-page-loading">

            <div className="admin-loading-spinner" />

            <p>
              Loading product catalog...
            </p>

          </div>

        </div>

      </main>

    )

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <main className="admin-products-page">

        <div className="admin-products-container">

          <div className="admin-page-error">

            <div className="admin-error-icon">
              !
            </div>

            <h2>
              Unable to load products
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


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <main className="admin-products-page">

      <div className="admin-products-container">


        {/* HEADER */}

        <div className="admin-products-header">

          <div className="admin-products-header-content">

            <Link
              to="/admin"
              className="admin-back-link"
            >
              ← Back to Admin Dashboard
            </Link>

            <span className="admin-products-label">
              PROJECT ORBIT • CATALOG
            </span>

            <h1>
              Product Management
            </h1>

            <p>
              Manage your product catalog,
              pricing, inventory and availability.
            </p>

          </div>


          <button
            type="button"
            className="admin-primary-button admin-add-product-button"
            onClick={handleOpenAddForm}
          >

            <span className="admin-button-icon">
              +
            </span>

            Add Product

          </button>

        </div>


        {/* STATUS ERROR */}

        {statusError && (

          <div
            className="admin-form-error admin-status-message"
            role="alert"
          >

            <span>
              !
            </span>

            {statusError}

          </div>

        )}


        {/* STATUS SUCCESS */}

        {statusSuccess && (

          <div
            className="admin-form-success admin-status-message"
            role="status"
          >

            <span>
              ✓
            </span>

            {statusSuccess}

          </div>

        )}


        {/* ADD / EDIT FORM */}

        {showProductForm && (

          <div className="admin-product-form-card">

            <div className="admin-product-form-header">

              <div>

                <span className="admin-products-label">

                  {editingProductId !== null
                    ? 'EDIT PRODUCT'
                    : 'NEW PRODUCT'
                  }

                </span>

                <h2>

                  {editingProductId !== null
                    ? 'Edit Product'
                    : 'Add Product'
                  }

                </h2>

                <p>

                  {editingProductId !== null
                    ? 'Update the selected product information.'
                    : 'Add a new product to the Project Orbit catalog.'
                  }

                </p>

              </div>


              <button
                type="button"
                className="admin-form-close-button"
                onClick={
                  handleCloseProductForm
                }
                disabled={formLoading}
              >
                ×
              </button>

            </div>


            {/* FORM ERROR */}

            {formError && (

              <div
                className="admin-form-error"
                role="alert"
              >

                <span>
                  !
                </span>

                {formError}

              </div>

            )}


            {/* FORM SUCCESS */}

            {formSuccess && (

              <div
                className="admin-form-success"
                role="status"
              >

                <span>
                  ✓
                </span>

                {formSuccess}

              </div>

            )}


            <form
              className="admin-product-form"
              onSubmit={
                handleProductSubmit
              }
            >

              <div className="admin-form-grid">


                {/* PRODUCT NAME */}

                <div className="admin-form-field">

                  <label htmlFor="product-name">
                    Product Name
                  </label>

                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter product name"
                    disabled={formLoading}
                  />

                </div>


                {/* CATEGORY */}

                <div className="admin-form-field">

                  <label htmlFor="product-category">
                    Category
                  </label>

                  <input
                    id="product-category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. Mobile"
                    disabled={formLoading}
                  />

                </div>


                {/* PRICE */}

                <div className="admin-form-field">

                  <label htmlFor="product-price">
                    Price
                  </label>

                  <div className="admin-input-prefix">

                    <span>
                      ₹
                    </span>

                    <input
                      id="product-price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={
                        handleInputChange
                      }
                      placeholder="69999.99"
                      disabled={formLoading}
                    />

                  </div>

                </div>


                {/* STOCK */}

                <div className="admin-form-field">

                  <label htmlFor="product-stock">
                    Stock Quantity
                  </label>

                  <input
                    id="product-stock"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    step="1"
                    value={
                      formData.stockQuantity
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="50"
                    disabled={formLoading}
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="admin-form-field admin-form-field-full">

                  <label htmlFor="product-description">
                    Description
                  </label>

                  <textarea
                    id="product-description"
                    name="description"
                    rows="4"
                    value={
                      formData.description
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter product description"
                    disabled={formLoading}
                  />

                </div>


                {/* IMAGE URL */}

                <div className="admin-form-field admin-form-field-full">

                  <label htmlFor="product-image-url">
                    Product Image URL
                  </label>

                  <input
                    id="product-image-url"
                    name="imageUrl"
                    type="text"
                    value={
                      formData.imageUrl
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="https://example.com/product.jpg"
                    disabled={formLoading}
                  />

                  <span className="admin-field-help">
                    Add a public image URL to display the
                    product image in the catalog.
                  </span>

                </div>


                {/* IMAGE PREVIEW */}

                {formData.imageUrl && (

                  <div className="admin-image-preview">

                    <span>
                      IMAGE PREVIEW
                    </span>

                    <img
                      src={
                        formData.imageUrl
                      }
                      alt="Product preview"
                      onError={(event) => {

                        event.currentTarget.style.display =
                          'none'

                      }}
                    />

                  </div>

                )}


                {/* ACTIVE */}

                <div className="admin-form-checkbox">

                  <input
                    id="product-active"
                    name="active"
                    type="checkbox"
                    checked={
                      formData.active
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={formLoading}
                  />

                  <label htmlFor="product-active">

                    <strong>
                      Product is active
                    </strong>

                    <span>
                      Active products are available
                      in the customer catalog.
                    </span>

                  </label>

                </div>

              </div>


              {/* FORM ACTIONS */}

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    handleCloseProductForm
                  }
                  disabled={formLoading}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={formLoading}
                >

                  {formLoading

                    ? editingProductId !== null
                      ? 'Updating Product...'
                      : 'Creating Product...'

                    : editingProductId !== null
                      ? 'Update Product'
                      : 'Create Product'

                  }

                </button>

              </div>

            </form>

          </div>

        )}


        {/* SUMMARY */}

        <div className="admin-products-summary">


          <div className="admin-summary-card">

            <div className="admin-summary-icon">
              ◈
            </div>

            <div>

              <span className="admin-summary-label">
                Total Products
              </span>

              <strong>
                {products.length}
              </strong>

            </div>

          </div>


          <div className="admin-summary-card">

            <div className="admin-summary-icon admin-summary-icon-active">
              ✓
            </div>

            <div>

              <span className="admin-summary-label">
                Active Products
              </span>

              <strong>
                {activeProducts}
              </strong>

            </div>

          </div>


          <div className="admin-summary-card">

            <div className="admin-summary-icon admin-summary-icon-inactive">
              ○
            </div>

            <div>

              <span className="admin-summary-label">
                Inactive Products
              </span>

              <strong>
                {inactiveProducts}
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

        </div>


        {/* EMPTY STATE */}

        {products.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📦
            </div>

            <span className="admin-products-label">
              CATALOG EMPTY
            </span>

            <h2>
              No Products Found
            </h2>

            <p>
              There are currently no products
              in the catalog.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={
                handleOpenAddForm
              }
            >
              + Add Your First Product
            </button>

          </div>

        ) : (

          <div className="admin-products-table-card">


            {/* TABLE HEADER */}

            <div className="admin-table-header">

              <div>

                <span className="admin-products-label">
                  PRODUCT CATALOG
                </span>

                <h2>
                  Products
                </h2>

                <p>
                  Manage your complete product catalog.
                </p>

              </div>


              <div className="admin-table-count">
                {products.length} products
              </div>

            </div>


            {/* TABLE */}

            <div className="admin-products-table-wrapper">

              <table className="admin-products-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {products.map(
                    product => (

                      <tr
                        key={
                          product.id
                        }
                      >

                        {/* ID */}

                        <td>

                          <span className="admin-product-id">
                            #{product.id}
                          </span>

                        </td>


                        {/* PRODUCT */}

                        <td>

                          <div className="admin-product-cell">

                            <div className="admin-product-thumbnail">

                              {product.imageUrl ? (

                                <img
                                  src={
                                    product.imageUrl
                                  }
                                  alt={
                                    product.name
                                  }
                                />

                              ) : (

                                <span>
                                  O
                                </span>

                              )}

                            </div>


                            <div className="admin-product-name">

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                {product.description}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          <span className="admin-category-badge">
                            {product.category}
                          </span>

                        </td>


                        {/* PRICE */}

                        <td>

                          <strong className="admin-product-price">

                            ₹

                            {Number(
                              product.price
                            ).toLocaleString(
                              'en-IN',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }
                            )}

                          </strong>

                        </td>


                        {/* STOCK */}

                        <td>

                          <span
                            className={
                              Number(
                                product.stockQuantity
                              ) > 0

                                ? 'admin-stock-value'

                                : 'admin-stock-value admin-stock-empty'
                            }
                          >

                            {
                              product.stockQuantity
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              product.active

                                ? 'admin-status-active'

                                : 'admin-status-inactive'
                            }
                          >

                            <span className="admin-status-dot" />

                            {product.active
                              ? 'Active'
                              : 'Inactive'
                            }

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">


                            <button
                              type="button"
                              className="admin-action-button"
                              onClick={() =>
                                handleOpenEditForm(
                                  product
                                )
                              }
                              disabled={
                                statusLoadingId ===
                                product.id
                              }
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              className={
                                product.active

                                  ? 'admin-action-button admin-danger-action'

                                  : 'admin-action-button admin-success-action'
                              }
                              onClick={() =>
                                handleToggleProductStatus(
                                  product
                                )
                              }
                              disabled={
                                statusLoadingId ===
                                product.id
                              }
                            >

                              {
                                statusLoadingId ===
                                product.id

                                  ? 'Updating...'

                                  : product.active
                                    ? 'Deactivate'
                                    : 'Activate'
                              }

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </main>

  )

}


export default AdminProducts