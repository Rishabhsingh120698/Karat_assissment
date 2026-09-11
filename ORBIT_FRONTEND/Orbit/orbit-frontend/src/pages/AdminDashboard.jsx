import { Link } from 'react-router-dom'

function AdminDashboard() {

  return (
    <main className="admin-dashboard-page">

      <div className="admin-dashboard-container">

        <div className="admin-dashboard-header">

          <span className="admin-dashboard-label">
            PROJECT ORBIT
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage products, inventory, and customer
            orders from one place.
          </p>

        </div>

        <div className="admin-dashboard-grid">

          <Link
            to="/admin/products"
            className="admin-dashboard-card"
          >

            <div className="admin-card-icon">
              📦
            </div>

            <div className="admin-card-content">

              <h2>
                Product Management
              </h2>

              <p>
                Create, update, activate, deactivate,
                and manage products.
              </p>

              <span className="admin-card-link">
                Manage Products →
              </span>

            </div>

          </Link>

          <Link
            to="/admin/inventory"
            className="admin-dashboard-card"
          >

            <div className="admin-card-icon">
              📊
            </div>

            <div className="admin-card-content">

              <h2>
                Inventory Management
              </h2>

              <p>
                View stock levels and manage product
                inventory.
              </p>

              <span className="admin-card-link">
                Manage Inventory →
              </span>

            </div>

          </Link>

          <Link
            to="/admin/orders"
            className="admin-dashboard-card"
          >

            <div className="admin-card-icon">
              🛒
            </div>

            <div className="admin-card-content">

              <h2>
                Order Management
              </h2>

              <p>
                View customer orders and manage
                their status.
              </p>

              <span className="admin-card-link">
                Manage Orders →
              </span>

            </div>

          </Link>

        </div>

        <div className="admin-dashboard-info">

          <div className="admin-info-icon">
            ✓
          </div>

          <div>

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

        </div>

      </div>

    </main>
  )
}

export default AdminDashboard