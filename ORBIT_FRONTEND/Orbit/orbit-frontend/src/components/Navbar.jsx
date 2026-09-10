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

  const handleLogout = () => {

    logout()

    navigate('/')
  }

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <div className="navbar-brand">

          <Link to="/">
            Project Orbit
          </Link>

        </div>

        <div className="navbar-links">

          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="navbar-link"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="navbar-link"
          >
            Cart
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="navbar-link"
            >
              My Orders
            </Link>
          )}

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

          {isAuthenticated && (
            <>
              <span className="navbar-user">
                Welcome, {username}
              </span>

              <span className="navbar-role">
                ({role})
              </span>

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