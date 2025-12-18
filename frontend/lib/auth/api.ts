const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Логируем API_URL для отладки
if (typeof window !== 'undefined') {
  console.log('[Auth API] API_URL:', API_URL)
}

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
  const startTime = Date.now()
  console.log('[Auth] Starting auth check', { API_URL, timestamp: new Date().toISOString() })
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.warn('[Auth] Request timeout after 3s, aborting')
      controller.abort()
    }, 3000)

    console.log('[Auth] Sending request to', `${API_URL}/auth/me`)
    
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    })

    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    console.log('[Auth] Response received', { 
      status: res.status, 
      statusText: res.statusText,
      ok: res.ok,
      duration: `${duration}ms`,
      headers: Object.fromEntries(res.headers.entries())
    })

    if (res.ok) {
      const data = await res.json()
      console.log('[Auth] Auth successful', { user: { id: data.id, email: data.email, role: data.role } })
      return {
        id: data.id,
        email: data.email || '',
        role: data.role,
      }
    }

    // 401 - не авторизован (это нормально)
    if (res.status === 401) {
      console.log('[Auth] Not authenticated (401) - this is normal if not logged in')
      return null
    }

    // Другие ошибки - логируем
    const errorText = await res.text().catch(() => 'Could not read error response')
    console.warn('[Auth] Auth check returned error status', { 
      status: res.status, 
      statusText: res.statusText,
      errorText 
    })
    return null
  } catch (error: any) {
    const duration = Date.now() - startTime
    // Если ошибка сети, таймаут или другая - возвращаем null
    if (error.name === 'AbortError') {
      console.error('[Auth] Request aborted (timeout)', { duration: `${duration}ms` })
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      console.error('[Auth] Network error', { 
        error: error.message, 
        duration: `${duration}ms`,
        stack: error.stack 
      })
    } else {
      console.error('[Auth] Auth check failed with error', { 
        error: error.message, 
        name: error.name,
        duration: `${duration}ms`,
        stack: error.stack 
      })
    }
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return checkAuth()
}

