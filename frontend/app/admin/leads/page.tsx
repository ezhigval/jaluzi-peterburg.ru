'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/lib/auth/guard'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  page_url?: string
  status: 'new' | 'contacted' | 'converted' | 'rejected'
  created_at: string
}

function LeadsPageContent() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLeads()
  }, [statusFilter])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const url = statusFilter 
        ? `${API_URL}/leads?status=${statusFilter}`
        : `${API_URL}/leads`
      
      const res = await fetch(url, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Failed to load leads')
      
      const data = await res.json()
      setLeads(data)
    } catch (error) {
      console.error('Failed to load leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const res = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      loadLeads()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const exportCSV = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
    window.open(`${API_URL}/leads/export`, '_blank')
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новая',
      contacted: 'Связались',
      converted: 'Конвертирована',
      rejected: 'Отклонена',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      converted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      (lead.email && lead.email.toLowerCase().includes(query))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Лиды</h1>
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Экспорт CSV
            </button>
          </div>

          {/* Фильтры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Статус</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Все статусы</option>
                <option value="new">Новая</option>
                <option value="contacted">Связались</option>
                <option value="converted">Конвертирована</option>
                <option value="rejected">Отклонена</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Поиск</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Имя, телефон, email..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Таблица */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Страница</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Лиды не найдены
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.page_url ? (
                          <a href={lead.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {lead.page_url.length > 30 ? lead.page_url.substring(0, 30) + '...' : lead.page_url}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="new">Новая</option>
                          <option value="contacted">Связались</option>
                          <option value="converted">Конвертирована</option>
                          <option value="rejected">Отклонена</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredLeads.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Всего: {filteredLeads.length} лид(ов)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  return (
    <AuthGuard>
      <LeadsPageContent />
    </AuthGuard>
  )
}

