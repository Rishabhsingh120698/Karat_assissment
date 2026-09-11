import { useContext } from 'react'
import {
  Link,
  useNavigate
} from 'react-router-dom'

import AuthContext from '../contexts/AuthContext'

function Navbar() {

  const {
    username,
    role,
    isAuthenticated,
    logout
  } = useContext(AuthContext)

  const navigate = useNavigate()


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    logout()

    navigate('/')

  }


  return (

    <nav className="navbar">

      <div className="navbar-container">


        {/* ================================================= */}
        {/* BRAND                                             */}
        {/* ================================================= */}

        <div className="navbar-brand">

          <Link to="/">
            Project Orbit
          </Link>

        </div>


        {/* ================================================= */}
        {/* NAVIGATION LINKS                                  */}
        {/* ================================================= */}

        <div className="navbar-links">


          {/* =============================================== */}
          {/* HOME                                            */}
          {/* =============================================== */}

          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>


          {/* =============================================== */}
          {/* PRODUCTS                                        */}
          {/* =============================================== */}

          <Link
            to="/products"
            className="navbar-link"
          >
            Products
          </Link>


          {/* =============================================== */}
          {/* CART                                            */}
          {/* =============================================== */}

          <Link
            to="/cart"
            className="navbar-link"
          >
            Cart
          </Link>


          {/* =============================================== */}
          {/* MY ORDERS                                       */}
          {/* =============================================== */}

          {isAuthenticated && (

            <Link
              to="/orders"
              className="navbar-link"
            >
              My Orders
            </Link>

          )}


          {/* =============================================== */}
          {/* ADMIN DASHBOARD                                 */}
          {/* =============================================== */}

          {isAuthenticated && role === 'ADMIN' && (

            <Link
              to="/admin"
              className="navbar-link"
            >
              Admin Dashboard
            </Link>

          )}


          {/* =============================================== */}
          {/* LOGIN / REGISTER                                */}
          {/* =============================================== */}

          {!isAuthenticated && (

            <>

              <Link
                to="/login"
                className="navbar-link"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="navbar-link"
              >
                Register
              </Link>

            </>

          )}


          {/* =============================================== */}
          {/* LOGGED-IN USER INFORMATION                      */}
          {/* =============================================== */}

          {isAuthenticated && (

            <>

              <span className="navbar-user">

                Welcome, {username}

              </span>


              <span className="navbar-role">

                ({role})

              </span>


              {/* ========================================= */}
              {/* LOGOUT BUTTON                              */}
              {/* ========================================= */}

              <button
                className="navbar-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>

          )}

        </div>

      </div>

    </nav>

  )

}

export default Navbar