'use client'

import { useCMSStore } from '@/lib/cms/store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type SidebarTab = 'content' | 'seo' | 'settings'

export function Sidebar() {
  const { 
    mode, 
    selectedBlockId, 
    blocks, 
    updateBlock, 
    save, 
    publish, 
    revert,
    isDirty, 
    isSaving,
    lastSaved,
    error,
    clearError,
    setMode 
  } = useCMSStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<SidebarTab>('content')

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  useEffect(() => {
    setIsOpen(!!selectedBlock)
    if (selectedBlock) {
      setActiveTab('content')
    }
  }, [selectedBlock])

  const handleSave = async () => {
    try {
      await save()
    } catch (err) {
      // Ошибка уже в store
    }
  }

  const handlePublish = async () => {
    const published = await publish()
    if (published) {
      setIsOpen(false)
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  if (mode !== 'edit') return null

  return (
    <>
      {/* Toggle button */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => {
            if (isDirty && !confirm('У вас есть несохранённые изменения. Вы уверены, что хотите выйти?')) {
              return
            }
            setMode('view')
            router.push('/admin')
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Выйти из редактирования
        </button>
        
        {isDirty && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
            ⚠️ Несохранённые изменения
          </div>
        )}

        {lastSaved && (
          <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-xs">
            Сохранено: {formatTime(lastSaved)}
          </div>
        )}
      </div>

      {/* Sidebar */}
      {isOpen && selectedBlock && (
        <aside className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Редактирование блока</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Тип:</span>
              <span className="font-medium uppercase">{selectedBlock.type}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                selectedBlock.status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {selectedBlock.status === 'published' ? 'Опубликовано' : 'Черновик'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'content'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Контент
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'seo'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Настройки
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded flex justify-between items-start">
              <span className="text-sm">{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">×</button>
            </div>
          )}

          {/* Tab content */}
          <div className="p-4">
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Редактирование данных блока в зависимости от типа */}
                {selectedBlock.type === 'hero' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите заголовок"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Подзаголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.subtitle || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { subtitle: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите подзаголовок"
                      />
                    </div>
                  </>
                )}

                {selectedBlock.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Текст</label>
                    <textarea
                      value={selectedBlock.data.content || ''}
                      onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                      className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите текст"
                    />
                  </div>
                )}

                {selectedBlock.type === 'cta' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Текст кнопки</label>
                      <input
                        type="text"
                        value={selectedBlock.data.buttonText || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { buttonText: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Ссылка</label>
                      <input
                        type="text"
                        value={selectedBlock.data.buttonLink || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { buttonLink: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#form или /page"
                      />
                    </div>
                  </>
                )}

                {selectedBlock.type === 'price' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Цена от</label>
                      <input
                        type="number"
                        value={selectedBlock.data.priceFrom || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { priceFrom: parseFloat(e.target.value) || 0 })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Валюта</label>
                      <input
                        type="text"
                        value={selectedBlock.data.currency || '₽'}
                        onChange={(e) => updateBlock(selectedBlock.id, { currency: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="₽"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Примечание</label>
                      <textarea
                        value={selectedBlock.data.notes || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { notes: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Например: за м²"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Тарифы</label>
                        <button
                          type="button"
                          onClick={() => {
                            const tiers = Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []
                            updateBlock(selectedBlock.id, {
                              tiers: [...tiers, { name: '', price: 0, description: '' }]
                            })
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []).map((tier: any, index: number) => (
                        <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-600">Тариф #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const tiers = Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []
                                updateBlock(selectedBlock.id, {
                                  tiers: tiers.filter((_: any, i: number) => i !== index)
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            value={tier.name || ''}
                            onChange={(e) => {
                              const tiers = Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []
                              const updated = [...tiers]
                              updated[index] = { ...updated[index], name: e.target.value }
                              updateBlock(selectedBlock.id, { tiers: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Название тарифа"
                          />
                          <input
                            type="number"
                            value={tier.price || ''}
                            onChange={(e) => {
                              const tiers = Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []
                              const updated = [...tiers]
                              updated[index] = { ...updated[index], price: parseFloat(e.target.value) || 0 }
                              updateBlock(selectedBlock.id, { tiers: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Цена"
                          />
                          <textarea
                            value={tier.description || ''}
                            onChange={(e) => {
                              const tiers = Array.isArray(selectedBlock.data.tiers) ? selectedBlock.data.tiers : []
                              const updated = [...tiers]
                              updated[index] = { ...updated[index], description: e.target.value }
                              updateBlock(selectedBlock.id, { tiers: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Описание"
                            rows={2}
                          />
                        </div>
                      ))}
                      {(!Array.isArray(selectedBlock.data.tiers) || selectedBlock.data.tiers.length === 0) && (
                        <p className="text-xs text-gray-500">Тарифы не добавлены</p>
                      )}
                    </div>
                  </>
                )}

                {selectedBlock.type === 'colors' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Выберите цвет"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Цвета</label>
                        <button
                          type="button"
                          onClick={() => {
                            const colors = Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []
                            updateBlock(selectedBlock.id, {
                              colors: [...colors, { name: '', hex: '#000000' }]
                            })
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []).map((color: any, index: number) => (
                        <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-600">Цвет #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const colors = Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []
                                updateBlock(selectedBlock.id, {
                                  colors: colors.filter((_: any, i: number) => i !== index)
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            value={color.name || ''}
                            onChange={(e) => {
                              const colors = Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []
                              const updated = [...colors]
                              updated[index] = { ...updated[index], name: e.target.value }
                              updateBlock(selectedBlock.id, { colors: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Название цвета"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={color.image || ''}
                              onChange={(e) => {
                                const colors = Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []
                                const updated = [...colors]
                                updated[index] = { ...updated[index], image: e.target.value, hex: undefined }
                                updateBlock(selectedBlock.id, { colors: updated })
                              }}
                              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="URL изображения"
                            />
                            <input
                              type="color"
                              value={color.hex || '#000000'}
                              onChange={(e) => {
                                const colors = Array.isArray(selectedBlock.data.colors) ? selectedBlock.data.colors : []
                                const updated = [...colors]
                                updated[index] = { ...updated[index], hex: e.target.value, image: undefined }
                                updateBlock(selectedBlock.id, { colors: updated })
                              }}
                              className="w-12 h-8 border rounded cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Используйте либо URL изображения, либо цвет (hex)</p>
                        </div>
                      ))}
                      {(!Array.isArray(selectedBlock.data.colors) || selectedBlock.data.colors.length === 0) && (
                        <p className="text-xs text-gray-500">Цвета не добавлены</p>
                      )}
                    </div>
                  </>
                )}

                {selectedBlock.type === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Наши работы"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Колонок</label>
                      <select
                        value={selectedBlock.data.columns || 3}
                        onChange={(e) => updateBlock(selectedBlock.id, { columns: parseInt(e.target.value) })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Изображения</label>
                        <button
                          type="button"
                          onClick={() => {
                            const images = Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []
                            updateBlock(selectedBlock.id, {
                              images: [...images, { url: '', caption: '', alt: '' }]
                            })
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []).map((image: any, index: number) => (
                        <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-600">Изображение #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const images = Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []
                                updateBlock(selectedBlock.id, {
                                  images: images.filter((_: any, i: number) => i !== index)
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="url"
                            value={image.url || ''}
                            onChange={(e) => {
                              const images = Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []
                              const updated = [...images]
                              updated[index] = { ...updated[index], url: e.target.value }
                              updateBlock(selectedBlock.id, { images: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="URL изображения"
                          />
                          <input
                            type="text"
                            value={image.caption || ''}
                            onChange={(e) => {
                              const images = Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []
                              const updated = [...images]
                              updated[index] = { ...updated[index], caption: e.target.value }
                              updateBlock(selectedBlock.id, { images: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Подпись (опционально)"
                          />
                          <input
                            type="text"
                            value={image.alt || ''}
                            onChange={(e) => {
                              const images = Array.isArray(selectedBlock.data.images) ? selectedBlock.data.images : []
                              const updated = [...images]
                              updated[index] = { ...updated[index], alt: e.target.value }
                              updateBlock(selectedBlock.id, { images: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Alt текст (опционально)"
                          />
                        </div>
                      ))}
                      {(!Array.isArray(selectedBlock.data.images) || selectedBlock.data.images.length === 0) && (
                        <p className="text-xs text-gray-500">Изображения не добавлены</p>
                      )}
                    </div>
                  </>
                )}

                {selectedBlock.type === 'faq' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Часто задаваемые вопросы"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Вопросы и ответы</label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                            updateBlock(selectedBlock.id, {
                              items: [...items, { question: '', answer: '' }]
                            })
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []).map((item: any, index: number) => (
                        <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-600">Вопрос #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                                updateBlock(selectedBlock.id, {
                                  items: items.filter((_: any, i: number) => i !== index)
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.question || ''}
                            onChange={(e) => {
                              const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                              const updated = [...items]
                              updated[index] = { ...updated[index], question: e.target.value }
                              updateBlock(selectedBlock.id, { items: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Вопрос"
                          />
                          <textarea
                            value={item.answer || ''}
                            onChange={(e) => {
                              const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                              const updated = [...items]
                              updated[index] = { ...updated[index], answer: e.target.value }
                              updateBlock(selectedBlock.id, { items: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ответ"
                            rows={3}
                          />
                        </div>
                      ))}
                      {(!Array.isArray(selectedBlock.data.items) || selectedBlock.data.items.length === 0) && (
                        <p className="text-xs text-gray-500">Вопросы не добавлены</p>
                      )}
                    </div>
                  </>
                )}

                {selectedBlock.type === 'features' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={selectedBlock.data.title || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Наши преимущества"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Колонок</label>
                      <select
                        value={selectedBlock.data.columns || 3}
                        onChange={(e) => updateBlock(selectedBlock.id, { columns: parseInt(e.target.value) })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Преимущества</label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                            updateBlock(selectedBlock.id, {
                              items: [...items, { title: '', description: '', icon: '' }]
                            })
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []).map((item: any, index: number) => (
                        <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-600">Преимущество #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                                updateBlock(selectedBlock.id, {
                                  items: items.filter((_: any, i: number) => i !== index)
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.icon || ''}
                            onChange={(e) => {
                              const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                              const updated = [...items]
                              updated[index] = { ...updated[index], icon: e.target.value }
                              updateBlock(selectedBlock.id, { items: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Эмодзи или иконка (например: 🎯)"
                          />
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                              const updated = [...items]
                              updated[index] = { ...updated[index], title: e.target.value }
                              updateBlock(selectedBlock.id, { items: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Заголовок"
                          />
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => {
                              const items = Array.isArray(selectedBlock.data.items) ? selectedBlock.data.items : []
                              const updated = [...items]
                              updated[index] = { ...updated[index], description: e.target.value }
                              updateBlock(selectedBlock.id, { items: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Описание (опционально)"
                            rows={2}
                          />
                        </div>
                      ))}
                      {(!Array.isArray(selectedBlock.data.items) || selectedBlock.data.items.length === 0) && (
                        <p className="text-xs text-gray-500">Преимущества не добавлены</p>
                      )}
                    </div>
                  </>
                )}

                {!['hero', 'text', 'cta', 'price', 'colors', 'gallery', 'faq', 'features'].includes(selectedBlock.type) && (
                  <div className="text-gray-500 text-sm">
                    Редактирование для типа "{selectedBlock.type}" пока не реализовано
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={selectedBlock.data.seoTitle || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { seoTitle: e.target.value })}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Мета-заголовок"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SEO Description</label>
                  <textarea
                    value={selectedBlock.data.seoDescription || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { seoDescription: e.target.value })}
                    className="w-full border rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Мета-описание"
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Статус</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-2 rounded ${
                      selectedBlock.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedBlock.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Версия</label>
                  <div className="text-sm text-gray-600">v{selectedBlock.version}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Порядок</label>
                  <div className="text-sm text-gray-600">{selectedBlock.order}</div>
                  <p className="text-xs text-gray-500 mt-1">Изменение порядка будет доступно позже</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Сохранение...
                  </>
                ) : (
                  <>
                    💾 Сохранить
                  </>
                )}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {selectedBlock.status === 'published' ? '✅ Опубликовано' : '🚀 Опубликовать'}
              </button>

              {isDirty && (
                <button
                  onClick={revert}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  ↩️ Отменить изменения
                </button>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
