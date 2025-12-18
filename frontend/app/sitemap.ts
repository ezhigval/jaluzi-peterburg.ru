import { MetadataRoute } from 'next'
import { getPageBySlug } from '@/lib/cms/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaluzi-peterburg.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Получаем список всех страниц из API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
  
  try {
    const response = await fetch(`${API_URL}/pages`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return getDefaultSitemap()
    }

    const pages = await response.json()
    
    // Фильтруем только опубликованные страницы
    const publishedPages = pages.filter((page: any) => page.status === 'published')
    
    const sitemapEntries: MetadataRoute.Sitemap = publishedPages.map((page: any) => {
      // Для главной страницы slug = 'home', URL должен быть '/'
      const path = page.slug === 'home' ? '' : `/${page.slug}`
      
      return {
        url: `${SITE_URL}${path}`,
        lastModified: new Date(page.updated_at || page.created_at),
        changeFrequency: 'weekly',
        priority: page.slug === 'home' ? 1.0 : 0.8,
      }
    })

    return sitemapEntries
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return getDefaultSitemap()
  }
}

function getDefaultSitemap(): MetadataRoute.Sitemap {
  // Fallback на базовые страницы
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}

