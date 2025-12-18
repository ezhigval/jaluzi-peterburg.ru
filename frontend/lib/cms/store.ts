import { create } from 'zustand'

export interface ContentBlock {
  id: string
  pageId: string
  type: string
  order: number
  data: Record<string, any>
  status: 'draft' | 'published'
  version: number
}

// API блок с snake_case полями
export interface APIContentBlock {
  id: string
  page_id: string
  type: string
  order: number
  data: Record<string, any>
  status: 'draft' | 'published'
  version: number
}

// Конвертация API блока в store блок
function convertAPIBlockToStore(apiBlock: APIContentBlock): ContentBlock {
  return {
    id: apiBlock.id,
    pageId: apiBlock.page_id,
    type: apiBlock.type,
    order: apiBlock.order,
    data: apiBlock.data,
    status: apiBlock.status,
    version: apiBlock.version,
  }
}

interface CMSStore {
  mode: 'view' | 'edit'
  selectedBlockId: string | null
  blocks: ContentBlock[]
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
  error: string | null

  setMode: (mode: 'view' | 'edit') => void
  selectBlock: (blockId: string | null) => void
  setBlocks: (blocks: ContentBlock[] | APIContentBlock[]) => void
  updateBlock: (blockId: string, data: Partial<ContentBlock['data']>) => void
  save: () => Promise<void>
  publish: () => Promise<boolean> // возвращает true если подтверждено
  revert: () => void
  clearError: () => void
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  mode: 'view',
  selectedBlockId: null,
  blocks: [],
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  error: null,

  setMode: (mode) => {
    const { isDirty } = get()
    if (mode === 'view' && isDirty) {
      // Предупреждение при попытке выйти с несохранёнными изменениями
      if (!confirm('У вас есть несохранённые изменения. Вы уверены, что хотите выйти?')) {
        return
      }
    }
    set({ mode, selectedBlockId: null })
  },

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),

  setBlocks: (blocks) => {
    const currentBlocks = get().blocks
    // Конвертируем API блоки в store блоки если нужно
    const convertedBlocks = blocks.map((block) => 
      'page_id' in block ? convertAPIBlockToStore(block as APIContentBlock) : block
    ) as ContentBlock[]
    
    // Проверяем, изменились ли блоки (сравниваем ID и порядок)
    const currentIds = currentBlocks.map(b => b.id).join(',')
    const newIds = convertedBlocks.map(b => b.id).join(',')
    
    // Обновляем только если действительно изменилось
    if (currentIds !== newIds || currentBlocks.length !== convertedBlocks.length) {
      set({ blocks: convertedBlocks, isDirty: false, lastSaved: new Date(), error: null })
    }
  },

  updateBlock: (blockId, data) => {
    const blocks = get().blocks.map((block) =>
      block.id === blockId
        ? { ...block, data: { ...block.data, ...data }, status: 'draft' as const }
        : block
    )
    set({ blocks, isDirty: true, error: null })
  },

  revert: () => {
    // Перезагрузить блоки с сервера (упрощённо - сбрасываем dirty)
    set({ isDirty: false, selectedBlockId: null, error: null })
    // TODO: перезагрузить с сервера
  },

  clearError: () => set({ error: null }),

  save: async () => {
    const { blocks } = get()

    set({ isSaving: true, error: null })
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      
      for (const block of blocks) {
        if (block.status === 'draft') {
          const res = await fetch(`${API_URL}/blocks/${block.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              type: block.type,
              order: block.order,
              data: block.data,
              status: block.status,
            }),
          })

          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.message || 'Failed to save block')
          }
        }
      }
      set({ isDirty: false, lastSaved: new Date() })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save blocks'
      set({ error: message })
      throw error
    } finally {
      set({ isSaving: false })
    }
  },

  publish: async () => {
    const { blocks } = get()

    // Подтверждение публикации
    const confirmed = window.confirm(
      'Вы уверены, что хотите опубликовать изменения? Они станут видимыми для всех посетителей сайта.'
    )

    if (!confirmed) {
      return false
    }

    set({ isSaving: true, error: null })
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      
      for (const block of blocks) {
        const res = await fetch(`${API_URL}/blocks/${block.id}/publish`, {
          method: 'POST',
          credentials: 'include',
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Failed to publish block')
        }
      }
      
      // Обновляем статусы блоков
      const updatedBlocks = blocks.map(block => ({ ...block, status: 'published' as const }))
      set({ blocks: updatedBlocks, isDirty: false, lastSaved: new Date() })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish blocks'
      set({ error: message })
      return false
    } finally {
      set({ isSaving: false })
    }
  },
}))
