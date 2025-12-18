'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/lib/auth/guard'
import { checkAuth, logout } from '@/lib/auth/api'
import { getAllPages } from '@/lib/cms/api'

interface Page {
  id: string
  slug: string
  title: string
  status: string
  updated_at?: string
  meta_title?: string
  meta_description?: string
}

function AdminDashboardContent() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        // Загружаем пользователя
        const userData = await checkAuth()
        if (cancelled) return
        if (userData) {
          setUser(userData)
        }

        // Загружаем страницы
        const pagesData = await getAllPages()
        if (cancelled) return
        setPages(pagesData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">{user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/leads"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-lg mb-1">Лиды</h3>
            <p className="text-sm text-gray-600">Просмотр и управление заявками</p>
          </Link>
          
          <Link
            href="/main/admin"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
          >
            <div className="text-2xl mb-2">🏠</div>
            <h3 className="font-semibold text-lg mb-1">Главная</h3>
            <p className="text-sm text-gray-600">Редактировать главную страницу</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-lg mb-1">Статистика</h3>
            <p className="text-sm text-gray-600">Скоро будет доступно</p>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Страницы сайта</h2>
            <p className="text-sm text-gray-600 mt-1">Редактирование контента страниц</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Страница
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Обновлено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Страницы не найдены
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500">/{page.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            page.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {page.status === 'published' ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.updated_at ? formatDate(page.updated_at) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/${page.slug}/admin`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Редактировать
                        </Link>
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Просмотр
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <AdminDashboardContent />
    </AuthGuard>
  )
}
