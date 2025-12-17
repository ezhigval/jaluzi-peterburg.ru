const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export interface Page {
  id: string
  slug: string
  title: string
  meta_title?: string
  meta_description?: string
  status: string
}

export interface ContentBlock {
  id: string
  page_id: string
  type: string
  order: number
  data: Record<string, any>
  status: 'draft' | 'published'
  version: number
}

export interface PageResponse {
  page: Page
  blocks: ContentBlock[]
}

export async function getPageBySlug(slug: string): Promise<PageResponse | null> {
  try {
    const res = await fetch(`${API_URL}/pages/${slug}`, {
      cache: 'no-store',
      credentials: 'include', // Для cookie
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return null
  }
}

