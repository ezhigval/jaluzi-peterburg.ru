'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQBlockProps {
  data: {
    title?: string
    items?: FAQItem[]
  }
}

export function FAQBlock({ data }: FAQBlockProps) {
  const items = data.items || []
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
        )}
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900">{item.question}</span>
                <span className="text-blue-600 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500">Вопросы не добавлены</p>
        )}
      </div>
    </div>
  )
}

