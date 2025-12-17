'use client'

import { useCMSStore } from '@/lib/cms/store'
import { useEffect } from 'react'

export function BlockOverlay() {
  const { mode, selectedBlockId, selectBlock } = useCMSStore()

  useEffect(() => {
    if (mode !== 'edit') return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const blockElement = target.closest('[data-block-id]')
      
      if (blockElement) {
        e.preventDefault()
        e.stopPropagation()
        const blockId = blockElement.getAttribute('data-block-id')
        if (blockId) {
          selectBlock(blockId)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [mode, selectBlock])

  return null
}

