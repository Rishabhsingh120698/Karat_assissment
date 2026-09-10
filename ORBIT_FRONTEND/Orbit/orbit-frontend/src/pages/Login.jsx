import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../services/authService'
import AuthContext from '../contexts/AuthContext'

function Login() {

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const {
    loginUser
  } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError('')

    if (username.trim() === '') {

      setError(
        'Username is required.'
      )

      return
    }

    if (password.trim() === '') {

      setError(
        'Password is required.'
      )

      return
    }

    if (password.length < 6) {

      setError(
        'Password must be at least 6 characters.'
      )

      return
    }

    try {

      setLoading(true)

      const response =
        await login(
          username.trim(),
          password
        )

      console.log(
        'Login successful:',
        response
      )

      loginUser(response)

      navigate('/products')

    } catch (error) {

      console.error(
        'Login failed:',
        error
      )

      setError(
        error.message ||
        'Invalid username or password.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <main className="auth-page">

      <div className="auth-container">

        <section className="auth-brand-panel">

          <div className="auth-brand-content">

            <span className="auth-brand-label">
              PROJECT ORBIT
            </span>

            <h1>
              Welcome Back
            </h1>

            <p>
              Sign in to continue shopping,
              manage your orders, and explore
              the Orbit marketplace.
            </p>

            <div className="auth-feature-list">

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>

                <span>
                  Browse products
                </span>
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>

                <span>
                  Manage your cart
                </span>
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>

                <span>
                  Track your orders
                </span>
              </div>

            </div>

          </div>

        </section>

        <section className="auth-form-panel">

          <div className="auth-form-container">

            <div className="auth-form-header">

              <span className="auth-mobile-brand">
                Project Orbit
              </span>

              <h2>
                Sign in
              </h2>

              <p>
                Enter your credentials to
                access your account.
              </p>

            </div>

            {error && (
              <div
                className="auth-error"
                role="alert"
              >

                <span className="auth-error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              <div className="form-field">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={loading}
                />

              </div>

              <div className="form-field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="button-spinner" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}

              </button>

            </form>

            <div className="auth-divider">
              <span>
                OR
              </span>
            </div>

            <p className="auth-register-text">

              Don't have an account?

              {' '}

              <Link to="/register">
                Create an account
              </Link>

            </p>

            <Link
              to="/"
              className="auth-back-link"
            >
              ← Back to Home
            </Link>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Login