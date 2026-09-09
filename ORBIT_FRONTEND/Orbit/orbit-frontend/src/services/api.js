const API_BASE_URL = 'http://localhost:9191'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    options
  )

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}`
    )
  }

  return response.json()
}

export { API_BASE_URL, apiRequest }