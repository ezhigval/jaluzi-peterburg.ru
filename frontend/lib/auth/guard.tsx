'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { checkAuth } from './api'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let cancelled = false
    console.log('[AuthGuard] Effect triggered', { pathname, cancelled })

    const verifyAuth = async () => {
      console.log('[AuthGuard] Starting verification', { pathname })
      try {
        const user = await checkAuth()
        console.log('[AuthGuard] checkAuth result', { user: user ? { id: user.id, email: user.email } : null, cancelled })
        
        if (cancelled) {
          console.log('[AuthGuard] Cancelled, ignoring result')
          return
        }

        if (user) {
          console.log('[AuthGuard] User authorized, setting authorized=true')
          setAuthorized(true)
        } else {
          // Редирект на логин с сохранением текущего пути
          const next = encodeURIComponent(pathname || '/admin')
          console.log('[AuthGuard] User not authorized, redirecting to login', { next, pathname })
          router.push(`/admin/login?next=${next}`)
        }
      } catch (error) {
        console.error('[AuthGuard] Auth verification error', { error, cancelled, pathname })
        if (!cancelled) {
          const next = encodeURIComponent(pathname || '/admin')
          console.log('[AuthGuard] Error occurred, redirecting to login', { next })
          router.push(`/admin/login?next=${next}`)
        }
      } finally {
        if (!cancelled) {
          console.log('[AuthGuard] Setting loading=false')
          setLoading(false)
        } else {
          console.log('[AuthGuard] Cancelled, not setting loading=false')
        }
      }
    }

    verifyAuth()

    return () => {
      console.log('[AuthGuard] Cleanup: setting cancelled=true')
      cancelled = true
    }
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}

