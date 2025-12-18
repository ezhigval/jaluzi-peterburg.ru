'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { extendedLeadFormSchema, type ExtendedLeadFormData } from '@/lib/schemas/lead-schemas'
import { useState } from 'react'

interface ExtendedLeadFormProps {
  onSubmit?: () => void
}

const serviceTypes = [
  { value: 'gorizontal', label: 'Горизонтальные жалюзи' },
  { value: 'vertical', label: 'Вертикальные жалюзи' },
  { value: 'rimskie', label: 'Римские шторы' },
  { value: 'remont', label: 'Ремонт жалюзи' },
  { value: 'other', label: 'Другое' },
]

export function ExtendedLeadForm({ onSubmit }: ExtendedLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExtendedLeadFormData>({
    resolver: zodResolver(extendedLeadFormSchema),
  })

  const onSubmitForm = async (data: ExtendedLeadFormData) => {
    // Проверка honeypot
    if (data.honeypot) {
      // Это бот, не отправляем
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const pageURL = typeof window !== 'undefined' ? window.location.href : ''

      // Формируем сообщение
      let message = ''
      if (data.serviceType) {
        const serviceLabel = serviceTypes.find(s => s.value === data.serviceType)?.label || data.serviceType
        message = `Тип услуги: ${serviceLabel}\n`
      }
      if (data.message) {
        message += data.message
      }

      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          message: message || undefined,
          page_url: pageURL,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Ошибка при отправке заявки')
      }

      setSubmitStatus('success')
      reset()
      onSubmit?.()
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
        <p className="font-semibold">Спасибо! Ваша заявка отправлена.</p>
        <p className="text-sm mt-1">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {/* Honeypot поле (скрытое) */}
      <input
        type="text"
        {...register('honeypot')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Ваше имя *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Иван Иванов"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Телефон *
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+7 (999) 123-45-67"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ivan@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium mb-1">
          Тип услуги
        </label>
        <select
          id="serviceType"
          {...register('serviceType')}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Выберите тип услуги</option>
          {serviceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Сообщение
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Расскажите подробнее о вашей заявке..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">
          <p className="text-sm">{errorMessage || 'Произошла ошибка при отправке'}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  )
}

