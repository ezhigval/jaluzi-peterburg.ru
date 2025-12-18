import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/cms/api'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Editor } from '@/components/cms/Editor'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
  searchParams: { admin?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getPageBySlug(params.slug)
  if (!data) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaluzi-peterburg.ru'
  const path = params.slug === 'home' ? '' : `/${params.slug}`
  const url = `${siteUrl}${path}`
  const title = data.page.meta_title || data.page.title
  const description = data.page.meta_description || 'Производство и установка жалюзи в Санкт-Петербурге'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Жалюзи-Петербург',
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const data = await getPageBySlug(params.slug)
  const isAdmin = searchParams.admin === 'true'

  if (!data) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaluzi-peterburg.ru'
  const path = params.slug === 'home' ? '' : `/${params.slug}`
  const url = `${siteUrl}${path}`

  // Определяем тип страницы для Schema.org
  const isServicePage = ['gorizontal', 'vertical', 'rimskie'].includes(params.slug)
  const isContactPage = params.slug === 'kontakty'
  const isHomePage = params.slug === 'home'

  // Breadcrumb для страниц услуг
  const breadcrumbItems = isServicePage
    ? [
        { name: 'Главная', url: siteUrl },
        { name: data.page.title, url },
      ]
    : []

  return (
    <>
      {/* Schema.org для главной страницы - LocalBusiness */}
      {isHomePage && (
        <SchemaOrg
          type="LocalBusiness"
          data={{
            name: 'Жалюзи-Петербург',
            url: siteUrl,
            telephone: '+7 (812) 123-45-67',
            address: {
              streetAddress: 'ул. Примерная, д. 1',
            },
          }}
        />
      )}

      {/* Schema.org для страниц услуг - Service */}
      {isServicePage && (
        <SchemaOrg
          type="Service"
          data={{
            serviceType: data.page.title,
            description: data.page.meta_description,
          }}
        />
      )}

      {/* Breadcrumb для страниц услуг */}
      {breadcrumbItems.length > 0 && (
        <SchemaOrg type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      )}

      <Editor blocks={data.blocks}>
        <main>
          {data.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </main>
      </Editor>
    </>
  )
}

