'use client'

import { useEffect } from 'react'
import { useCMSStore } from '@/lib/cms/store'
import { Sidebar } from './Sidebar'
import { BlockOverlay } from './BlockOverlay'

interface EditorProps {
  children: React.ReactNode
  blocks: any[]
}

export function Editor({ children, blocks }: EditorProps) {
  const { mode, setBlocks, setMode } = useCMSStore()

  useEffect(() => {
    setBlocks(blocks)
  }, [blocks, setBlocks])

  if (mode === 'view') {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <BlockOverlay />
      <Sidebar />
    </div>
  )
}

