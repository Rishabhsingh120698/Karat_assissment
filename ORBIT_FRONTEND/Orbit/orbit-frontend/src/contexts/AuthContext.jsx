import { createContext, useState } from 'react'

const AuthContext = createContext(null)

function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () => localStorage.getItem('orbitToken')
  )

  const [username, setUsername] = useState(
    () => localStorage.getItem('orbitUsername')
  )

  const [role, setRole] = useState(
    () => localStorage.getItem('orbitRole')
  )

  const loginUser = (loginResponse) => {

    const receivedToken = loginResponse.token
    const receivedUsername = loginResponse.username
    const receivedRole = loginResponse.role

    localStorage.setItem(
      'orbitToken',
      receivedToken
    )

    localStorage.setItem(
      'orbitUsername',
      receivedUsername
    )

    localStorage.setItem(
      'orbitRole',
      receivedRole
    )

    setToken(receivedToken)
    setUsername(receivedUsername)
    setRole(receivedRole)
  }

  const logout = () => {

    localStorage.removeItem('orbitToken')
    localStorage.removeItem('orbitUsername')
    localStorage.removeItem('orbitRole')

    setToken(null)
    setUsername(null)
    setRole(null)
  }

  const isAuthenticated =
    token !== null

  return (
    <AuthContext
      value={{
        token,
        username,
        role,
        isAuthenticated,
        loginUser,
        logout
      }}
    >
      {children}
    </AuthContext>
  )
}

export { AuthProvider }

export default AuthContext