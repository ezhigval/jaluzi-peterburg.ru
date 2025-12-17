'use client'

import { useCMSStore } from '@/lib/cms/store'
import { Hero } from './Hero'
import { Text } from './Text'
import { CTA } from './CTA'

interface BlockRendererProps {
  block: {
    id: string
    type: string
    data: Record<string, any>
  }
}

const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  hero: Hero,
  text: Text,
  cta: CTA,
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { mode, selectedBlockId, selectBlock } = useCMSStore()
  const Component = blockComponents[block.type] || Text

  const isSelected = mode === 'edit' && selectedBlockId === block.id
  const className = `cms-block ${isSelected ? 'selected' : ''}`

  return (
    <div
      data-block-id={block.id}
      data-block-type={block.type}
      className={className}
      onClick={() => mode === 'edit' && selectBlock(block.id)}
    >
      <Component data={block.data} />
    </div>
  )
}

