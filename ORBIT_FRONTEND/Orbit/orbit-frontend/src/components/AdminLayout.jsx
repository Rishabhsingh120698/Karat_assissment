import { NavLink, Outlet } from 'react-router-dom'

function AdminLayout() {

  return (

    <div className="admin-layout">

      {/* ============================= */}
      {/* ADMIN SIDEBAR                  */}
      {/* ============================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">

          <span className="admin-sidebar-label">
            PROJECT ORBIT
          </span>

          <h2>
            Admin Panel
          </h2>

        </div>


        {/* ============================= */}
        {/* NAVIGATION                     */}
        {/* ============================= */}

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            <span>
              🏠
            </span>

            <span>
              Dashboard
            </span>

          </NavLink>


          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            <span>
              📦
            </span>

            <span>
              Products
            </span>

          </NavLink>


          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            <span>
              📊
            </span>

            <span>
              Inventory
            </span>

          </NavLink>


          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            <span>
              🛒
            </span>

            <span>
              Orders
            </span>

          </NavLink>

        </nav>


        {/* ============================= */}
        {/* ADMIN INFORMATION              */}
        {/* ============================= */}

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-role">
            <span>
              👤
            </span>

            <div>

              <strong>
                Administrator
              </strong>

              <small>
                ADMIN
              </small>

            </div>

          </div>

        </div>

      </aside>


      {/* ============================= */}
      {/* ADMIN CONTENT                  */}
      {/* ============================= */}

      <main className="admin-layout-content">

        <Outlet />

      </main>

    </div>
  )
}

export default AdminLayout