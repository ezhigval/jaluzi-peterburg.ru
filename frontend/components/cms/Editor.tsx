'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { useCMSStore } from '@/lib/cms/store'
import { Sidebar } from './Sidebar'
import { BlockOverlay } from './BlockOverlay'
import { useRouter } from 'next/navigation'

interface EditorProps {
  children: React.ReactNode
  blocks: any[]
}

export function Editor({ children, blocks }: EditorProps) {
  const { mode, setBlocks, setMode, isDirty } = useCMSStore()
  const router = useRouter()
  const blocksRef = useRef<string>('')
  
  // Устанавливаем блоки только если изменились ID блоков (чтобы избежать бесконечного цикла)
  const blocksIdsString = blocks.map(b => b.id).sort().join(',')
  useEffect(() => {
    if (blocksRef.current !== blocksIdsString) {
      blocksRef.current = blocksIdsString
      setBlocks(blocks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksIdsString])

  // Блокировка навигации при dirty state
  useEffect(() => {
    if (!isDirty || mode !== 'edit') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'У вас есть несохранённые изменения. Вы уверены, что хотите уйти?'
      return e.returnValue
    }

    const handleRouteChange = () => {
      if (isDirty && !confirm('У вас есть несохранённые изменения. Вы уверены, что хотите уйти?')) {
        router.refresh()
        return false
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, mode, router])

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
