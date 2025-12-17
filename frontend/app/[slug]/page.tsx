import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/cms/api'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Editor } from '@/components/cms/Editor'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
  searchParams: { admin?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getPageBySlug(params.slug)
  if (!data) return {}

  return {
    title: data.page.meta_title || data.page.title,
    description: data.page.meta_description,
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const data = await getPageBySlug(params.slug)
  const isAdmin = searchParams.admin === 'true'

  if (!data) {
    notFound()
  }

  return (
    <Editor blocks={data.blocks}>
      <main>
        {data.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </main>
    </Editor>
  )
}

