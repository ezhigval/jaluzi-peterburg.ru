'use client'

import { useCMSStore } from '@/lib/cms/store'
import { useEffect } from 'react'

export function BlockOverlay() {
  const { mode, selectedBlockId, selectBlock } = useCMSStore()

  useEffect(() => {
    if (mode !== 'edit') return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Не обрабатываем клики внутри Sidebar, форм, input'ов, select'ов, textarea
      if (target.closest('aside, .fixed.right-0, form, input, select, textarea, [role="dialog"], [role="menu"]')) {
        return
      }
      
      // Не блокируем клики по ссылкам и кнопкам
      if (target.closest('a, button, [role="button"]')) {
        return
      }

      const blockElement = target.closest('[data-block-id]')
      
      if (blockElement) {
        e.preventDefault()
        e.stopPropagation()
        const blockId = blockElement.getAttribute('data-block-id')
        if (blockId) {
          selectBlock(blockId)
        }
      } else {
        // Клик вне блока - снимаем выделение (только если не внутри UI элементов)
        selectBlock(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectBlock(null)
      }
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode, selectBlock])

  useEffect(() => {
    // Добавляем стили для hover и selected состояний
    if (mode !== 'edit') return

    const style = document.createElement('style')
    style.textContent = `
      [data-block-id] {
        position: relative;
        transition: outline 0.2s;
      }
      [data-block-id]:hover {
        outline: 2px dashed rgba(59, 130, 246, 0.5) !important;
        outline-offset: 2px;
        cursor: pointer;
      }
      [data-block-id].cms-selected {
        outline: 2px solid rgb(59, 130, 246) !important;
        outline-offset: 2px;
      }
      .cms-block-label {
        position: absolute;
        top: -24px;
        left: 0;
        background: rgb(59, 130, 246);
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
        border-radius: 4px 4px 0 0;
        pointer-events: none;
        z-index: 100;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [mode])

  // Добавляем классы и labels к блокам
  useEffect(() => {
    if (mode !== 'edit') return

    const blocks = document.querySelectorAll('[data-block-id]')
    blocks.forEach((block) => {
      const blockId = block.getAttribute('data-block-id')
      const blockType = block.getAttribute('data-block-type')
      
      // Удаляем старые labels
      const oldLabel = block.querySelector('.cms-block-label')
      if (oldLabel) oldLabel.remove()

      // Добавляем класс selected
      if (blockId === selectedBlockId) {
        block.classList.add('cms-selected')
        
        // Добавляем label
        const label = document.createElement('div')
        label.className = 'cms-block-label'
        label.textContent = blockType ? blockType.toUpperCase() : 'BLOCK'
        block.appendChild(label)
      } else {
        block.classList.remove('cms-selected')
      }
    })

    return () => {
      // Очистка при размонтировании
      blocks.forEach((block) => {
        block.classList.remove('cms-selected')
        const label = block.querySelector('.cms-block-label')
        if (label) label.remove()
      })
    }
  }, [mode, selectedBlockId])

  return null
}
