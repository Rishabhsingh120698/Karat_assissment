import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext'

function ProtectedRoute({ children }) {

  const {
    isAuthenticated
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

  return children
}

export default ProtectedRoute