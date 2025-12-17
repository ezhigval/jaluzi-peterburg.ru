const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  role: string
}

export interface LoginResponse {
  user: User
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Важно для cookie
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Login failed')
  }

  return res.json()
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function checkAuth(): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })

    if (res.ok) {
      const data = await res.json()
      return {
        id: data.id,
        email: data.email || '',
        role: data.role,
      }
    }

    return null
  } catch {
    return null
  }
}

