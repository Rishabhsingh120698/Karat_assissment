import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    setError('')

    if (username.trim() === '') {
      setError('Username is required')
      return
    }

    if (password.trim() === '') {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    console.log('Username:', username)
    console.log('Password:', password)

    navigate('/products')
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Username:</label>

          <input
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Password:</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <br />

        {error && (
          <p>{error}</p>
        )}

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  )
}

export default Login