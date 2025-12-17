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

interface CMSStore {
  mode: 'view' | 'edit'
  selectedBlockId: string | null
  blocks: ContentBlock[]
  isDirty: boolean
  isSaving: boolean

  setMode: (mode: 'view' | 'edit') => void
  selectBlock: (blockId: string | null) => void
  setBlocks: (blocks: ContentBlock[]) => void
  updateBlock: (blockId: string, data: Partial<ContentBlock['data']>) => void
  save: () => Promise<void>
  publish: () => Promise<void>
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  mode: 'view',
  selectedBlockId: null,
  blocks: [],
  isDirty: false,
  isSaving: false,

  setMode: (mode) => set({ mode }),

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),

  setBlocks: (blocks) => set({ blocks, isDirty: false }),

  updateBlock: (blockId, data) => {
    const blocks = get().blocks.map((block) =>
      block.id === blockId
        ? { ...block, data: { ...block.data, ...data }, status: 'draft' as const }
        : block
    )
    set({ blocks, isDirty: true })
  },

  save: async () => {
    const { blocks } = get()

    set({ isSaving: true })
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      
      for (const block of blocks) {
        if (block.status === 'draft') {
          await fetch(`${API_URL}/blocks/${block.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Cookie автоматически отправится
            body: JSON.stringify(block),
          })
        }
      }
      set({ isDirty: false })
    } catch (error) {
      console.error('Failed to save blocks:', error)
    } finally {
      set({ isSaving: false })
    }
  },

  publish: async () => {
    const { blocks } = get()

    set({ isSaving: true })
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      
      for (const block of blocks) {
        await fetch(`${API_URL}/blocks/${block.id}/publish`, {
          method: 'POST',
          credentials: 'include', // Cookie автоматически отправится
        })
      }
      set({ isDirty: false })
    } catch (error) {
      console.error('Failed to publish blocks:', error)
    } finally {
      set({ isSaving: false })
    }
  },
}))

