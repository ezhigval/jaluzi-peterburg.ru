import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/cms/api'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Editor } from '@/components/cms/Editor'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageBySlug('home')
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaluzi-peterburg.ru'
  const title = data?.page.meta_title || data?.page.title || 'Жалюзи в Санкт-Петербурге'
  const description = data?.page.meta_description || 'Производство и установка жалюзи в Санкт-Петербурге'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
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
      canonical: siteUrl,
    },
  }
}

export default async function Home() {
  const data = await getPageBySlug('home')

  if (!data) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaluzi-peterburg.ru'

  return (
    <>
      {/* Schema.org LocalBusiness для главной страницы */}
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

