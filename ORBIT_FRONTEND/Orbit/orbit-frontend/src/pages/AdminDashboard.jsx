import { Link } from 'react-router-dom'

function AdminDashboard() {

  return (
    <main className="admin-dashboard-page">

      <div className="admin-dashboard-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-dashboard-header">

          <div>

            <span className="admin-dashboard-label">
              PROJECT ORBIT • ADMIN
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage products, inventory, and customer
              orders from one place.
            </p>

          </div>

          <div className="admin-dashboard-badge">

            <span className="admin-dashboard-badge-icon">
              ✓
            </span>

            <div>

              <strong>
                Administrator
              </strong>

              <small>
                Full access
              </small>

            </div>

          </div>

        </div>


        {/* =================================================
            MANAGEMENT CARDS
        ================================================= */}

        <div className="admin-dashboard-section-heading">

          <div>

            <span>
              MANAGEMENT
            </span>

            <h2>
              Control Center
            </h2>

          </div>

          <p>
            Select an area to manage
          </p>

        </div>


        <div className="admin-dashboard-grid">


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <Link
            to="/admin/products"
            className="admin-dashboard-card"
          >

            <div className="admin-card-top">

              <div className="admin-card-icon">
                📦
              </div>

              <span className="admin-card-arrow">
                →
              </span>

            </div>

            <div className="admin-card-content">

              <span className="admin-card-label">
                CATALOG
              </span>

              <h2>
                Product Management
              </h2>

              <p>
                Create, update, activate, deactivate,
                and manage products.
              </p>

              <span className="admin-card-link">
                Manage Products
                <span>→</span>
              </span>

            </div>

          </Link>


          {/* =================================================
              INVENTORY
          ================================================= */}

          <Link
            to="/admin/inventory"
            className="admin-dashboard-card"
          >

            <div className="admin-card-top">

              <div className="admin-card-icon">
                📊
              </div>

              <span className="admin-card-arrow">
                →
              </span>

            </div>

            <div className="admin-card-content">

              <span className="admin-card-label">
                STOCK CONTROL
              </span>

              <h2>
                Inventory Management
              </h2>

              <p>
                View stock levels and manage product
                inventory.
              </p>

              <span className="admin-card-link">
                Manage Inventory
                <span>→</span>
              </span>

            </div>

          </Link>


          {/* =================================================
              ORDERS
          ================================================= */}

          <Link
            to="/admin/orders"
            className="admin-dashboard-card"
          >

            <div className="admin-card-top">

              <div className="admin-card-icon">
                🛒
              </div>

              <span className="admin-card-arrow">
                →
              </span>

            </div>

            <div className="admin-card-content">

              <span className="admin-card-label">
                OPERATIONS
              </span>

              <h2>
                Order Management
              </h2>

              <p>
                View customer orders and manage
                their status.
              </p>

              <span className="admin-card-link">
                Manage Orders
                <span>→</span>
              </span>

            </div>

          </Link>

        </div>


        {/* =================================================
            ADMIN ACCESS INFORMATION
        ================================================= */}

        <div className="admin-dashboard-info">

          <div className="admin-info-icon">
            ✓
          </div>

          <div className="admin-info-content">

            <span>
              SECURITY
            </span>

            <h3>
              Administrator Access
            </h3>

            <p>
              You are viewing the administrative
              section of Project Orbit. Only users
              with the ADMIN role can access these
              features.
            </p>

          </div>

          <div className="admin-info-status">
            <span></span>
            Protected
          </div>

        </div>

      </div>

    </main>
  )
}

export default AdminDashboard