import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Жалюзи в Санкт-Петербурге | Производство и установка',
  description: 'Производство и установка жалюзи в Санкт-Петербурге. Горизонтальные, вертикальные, рулонные жалюзи. Гарантия качества.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

