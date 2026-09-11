import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../services/authService'

function Register() {

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError('')
    setSuccess('')

    if (username.trim() === '') {

      setError(
        'Username is required.'
      )

      return
    }

    if (username.trim().length < 3) {

      setError(
        'Username must be at least 3 characters.'
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

    if (confirmPassword.trim() === '') {

      setError(
        'Please confirm your password.'
      )

      return
    }

    if (password !== confirmPassword) {

      setError(
        'Passwords do not match.'
      )

      return
    }

    try {

      setLoading(true)

      const response =
        await register(
          username.trim(),
          password
        )

      console.log(
        'Registration successful:',
        response
      )

      setSuccess(
        'Account created successfully. Redirecting to login...'
      )

      setUsername('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {

        navigate('/login')

      }, 1500)

    } catch (error) {

      console.error(
        'Registration failed:',
        error
      )

      setError(
        error.message ||
        'Registration failed. Please try again.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <main className="auth-page">

      <div className="auth-container">

        {/* LEFT BRAND PANEL */}

        <section className="auth-brand-panel">

          <div className="auth-brand-decoration auth-decoration-one" />
          <div className="auth-brand-decoration auth-decoration-two" />

          <div className="auth-brand-content">

            <div className="auth-orbit-mark">
              O
            </div>

            <span className="auth-brand-label">
              PROJECT ORBIT
            </span>

            <h1>
              Join Orbit
            </h1>

            <p>
              Create your account and start
              exploring the Project Orbit
              e-commerce experience.
            </p>

            <div className="auth-feature-list">

              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                <span>
                  Explore products
                </span>

              </div>

              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                <span>
                  Build your cart
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

            <div className="auth-brand-footer">
              <span />
              <small>
                CREATE • SHOP • DISCOVER
              </small>
            </div>

          </div>

        </section>


        {/* RIGHT FORM PANEL */}

        <section className="auth-form-panel">

          <div className="auth-form-container">

            <div className="auth-form-header">

              <span className="auth-mobile-brand">
                PROJECT ORBIT
              </span>

              <span className="auth-form-eyebrow">
                GET STARTED
              </span>

              <h2>
                Create Account
              </h2>

              <p>
                Fill in the details below to
                create your customer account.
              </p>

            </div>


            {/* ERROR */}

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


            {/* SUCCESS */}

            {success && (

              <div
                className="auth-success"
                role="status"
              >

                <span className="auth-success-icon">
                  ✓
                </span>

                <span>
                  {success}
                </span>

              </div>

            )}


            {/* REGISTER FORM */}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              <div className="form-field">

                <label htmlFor="register-username">
                  Username
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    @
                  </span>

                  <input
                    id="register-username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                      )
                    }
                    placeholder="Choose a username"
                    autoComplete="username"
                    disabled={loading}
                  />

                </div>

              </div>


              <div className="form-field">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    •
                  </span>

                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                </div>

                <span className="auth-field-hint">
                  Minimum 6 characters
                </span>

              </div>


              <div className="form-field">

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    •
                  </span>

                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                </div>

              </div>


              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >

                {loading ? (

                  <>

                    <span className="button-spinner" />

                    Creating Account...

                  </>

                ) : (

                  <>

                    Create Account

                    <span className="auth-submit-arrow">
                      →
                    </span>

                  </>

                )}

              </button>

            </form>


            <div className="auth-divider">

              <span>
                OR
              </span>

            </div>


            <p className="auth-register-text">

              Already have an account?

              {' '}

              <Link to="/login">
                Sign in
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

export default Register