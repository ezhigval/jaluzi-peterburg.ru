'use client'

import { useEffect, useState } from 'react'
import { useCMSStore } from '@/lib/cms/store'
import { getPageBySlug } from '@/lib/cms/api'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Editor } from '@/components/cms/Editor'
import { AuthGuard } from '@/lib/auth/guard'

function GorizontalAdminPageContent() {
  const { setMode, setBlocks, blocks } = useCMSStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMode('edit')
  }, [setMode])

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await getPageBySlug('gorizontal')
        if (data) {
          setBlocks(data.blocks)
        }
      } catch (error) {
        console.error('Failed to load page:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [setBlocks])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <Editor blocks={blocks}>
      <main>
        {blocks.length > 0 ? (
          blocks.map((block) => <BlockRenderer key={block.id} block={block} />)
        ) : (
          <div className="container mx-auto px-4 py-12">
            <p className="text-gray-500">Страница пуста. Добавьте блоки через API.</p>
          </div>
        )}
      </main>
    </Editor>
  )
}

export default function GorizontalAdminPage() {
  return (
    <AuthGuard>
      <GorizontalAdminPageContent />
    </AuthGuard>
  )
}

