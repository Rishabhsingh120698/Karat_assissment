import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext'

function AdminRoute({ children }) {

  const {
    isAuthenticated,
    role
  } = useContext(AuthContext)

  const location = useLocation()

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    )
  }

  if (role !== 'ADMIN') {

    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}

export default AdminRoute