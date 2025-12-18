const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  page_url?: string
  status: 'new' | 'contacted' | 'converted' | 'rejected'
  created_at: string
}

export async function createLead(data: {
  name: string
  phone: string
  email?: string
  message?: string
  page_url?: string
}): Promise<Lead> {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to create lead')
  }

  return res.json()
}

