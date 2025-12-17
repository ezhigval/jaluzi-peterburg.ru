'use client'

import { useCMSStore } from '@/lib/cms/store'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const { mode, selectedBlockId, blocks, updateBlock, save, publish, isDirty, isSaving, setMode } = useCMSStore()
  const [isOpen, setIsOpen] = useState(false)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  useEffect(() => {
    setIsOpen(!!selectedBlock)
  }, [selectedBlock])

  if (mode !== 'edit') return null

  return (
    <>
      {/* Toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setMode('view')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Выйти из редактирования
        </button>
      </div>

      {/* Sidebar */}
      {isOpen && selectedBlock && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Редактирование блока</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Тип: {selectedBlock.type}</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Редактирование данных блока в зависимости от типа */}
            {selectedBlock.type === 'hero' && (
              <div>
                <label className="block text-sm font-medium mb-1">Заголовок</label>
                <input
                  type="text"
                  value={selectedBlock.data.title || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            {selectedBlock.type === 'text' && (
              <div>
                <label className="block text-sm font-medium mb-1">Текст</label>
                <textarea
                  value={selectedBlock.data.content || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-32"
                />
              </div>
            )}

            {/* Кнопки действий */}
            <div className="space-y-2 pt-4 border-t">
              <button
                onClick={save}
                disabled={!isDirty || isSaving}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={publish}
                disabled={isSaving}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

