import {
  createContext,
  useState
} from 'react'

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

  const [userId, setUserId] = useState(
    () => localStorage.getItem('orbitUserId')
  )


  // =========================================================
  // Decode JWT payload
  // =========================================================

  const getUserIdFromToken = (jwtToken) => {

    try {

      if (!jwtToken) {
        return null
      }

      const parts = jwtToken.split('.')

      if (parts.length !== 3) {
        return null
      }

      const payload = parts[1]

      const decodedPayload =
        JSON.parse(
          atob(
            payload
              .replace(/-/g, '+')
              .replace(/_/g, '/')
          )
        )

      return (
        decodedPayload.userId ??
        decodedPayload.user_id ??
        decodedPayload.id ??
        null
      )

    } catch (error) {

      console.error(
        'Unable to decode JWT:',
        error
      )

      return null
    }
  }


  // =========================================================
  // LOGIN
  // =========================================================

  const loginUser = (loginResponse) => {

    const receivedToken =
      loginResponse.token

    const receivedUsername =
      loginResponse.username

    const receivedRole =
      loginResponse.role

    const receivedUserId =
      getUserIdFromToken(receivedToken)


    // -----------------------------
    // Save in localStorage
    // -----------------------------

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

    if (receivedUserId !== null) {

      localStorage.setItem(
        'orbitUserId',
        String(receivedUserId)
      )

    }


    // -----------------------------
    // Update React state
    // -----------------------------

    setToken(receivedToken)

    setUsername(receivedUsername)

    setRole(receivedRole)

    setUserId(receivedUserId)
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.removeItem(
      'orbitToken'
    )

    localStorage.removeItem(
      'orbitUsername'
    )

    localStorage.removeItem(
      'orbitRole'
    )

    localStorage.removeItem(
      'orbitUserId'
    )


    setToken(null)

    setUsername(null)

    setRole(null)

    setUserId(null)
  }


  // =========================================================
  // AUTHENTICATION STATUS
  // =========================================================

  const isAuthenticated =
    token !== null


  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <AuthContext
      value={{
        token,
        username,
        role,
        userId,
        isAuthenticated,
        loginUser,
        logout
      }}
    >

      {children}

    </AuthContext>
  )
}


export {
  AuthProvider
}

export default AuthContext