'use client'

import { useCMSStore } from '@/lib/cms/store'
import { Hero } from './Hero'
import { Text } from './Text'
import { CTA } from './CTA'
import { PriceBlock } from './PriceBlock'
import { ColorsBlock } from './ColorsBlock'
import { GalleryBlock } from './GalleryBlock'
import { FAQBlock } from './FAQBlock'
import { FeaturesBlock } from './FeaturesBlock'

interface BlockRendererProps {
  block: {
    id: string
    type: string
    data: Record<string, any>
    status?: 'draft' | 'published'
  }
}

const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  hero: Hero,
  text: Text,
  cta: CTA,
  price: PriceBlock,
  colors: ColorsBlock,
  gallery: GalleryBlock,
  faq: FAQBlock,
  features: FeaturesBlock,
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { mode } = useCMSStore()
  const Component = blockComponents[block.type] || Text

  return (
    <div
      data-block-id={block.id}
      data-block-type={block.type}
      className="cms-block"
    >
      <Component data={block.data} />
    </div>
  )
}

