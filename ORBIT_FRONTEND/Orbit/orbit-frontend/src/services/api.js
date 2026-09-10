const API_BASE_URL = 'http://localhost:9191'

async function apiRequest(endpoint, options = {}) {

  const token =
    localStorage.getItem('orbitToken')

  const headers = {
    ...options.headers
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  )

  if (!response.ok) {

    if (response.status === 401) {
      throw new Error(
        'Unauthorized. Please login again.'
      )
    }

    if (response.status === 403) {
      throw new Error(
        'You do not have permission to perform this action.'
      )
    }

    throw new Error(
      `API request failed with status ${response.status}`
    )
  }

  return response.json()
}

export {
  API_BASE_URL,
  apiRequest
}