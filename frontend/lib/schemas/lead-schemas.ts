import { z } from 'zod'

// Короткая форма (имя + телефон)
export const shortLeadFormSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100),
  phone: z.string().min(10, 'Телефон должен быть корректным').regex(/^[\d\s\-\+\(\)]+$/, 'Некорректный формат телефона'),
  honeypot: z.string().optional(), // Honeypot поле
})

// Расширенная форма
export const extendedLeadFormSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100),
  phone: z.string().min(10, 'Телефон должен быть корректным').regex(/^[\d\s\-\+\(\)]+$/, 'Некорректный формат телефона'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  message: z.string().max(1000, 'Сообщение слишком длинное').optional(),
  serviceType: z.string().optional(), // Тип услуги
  honeypot: z.string().optional(), // Honeypot поле
})

export type ShortLeadFormData = z.infer<typeof shortLeadFormSchema>
export type ExtendedLeadFormData = z.infer<typeof extendedLeadFormSchema>

