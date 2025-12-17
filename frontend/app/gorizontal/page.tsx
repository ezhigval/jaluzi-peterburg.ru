import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/cms/api'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Editor } from '@/components/cms/Editor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Горизонтальные жалюзи в Санкт-Петербурге | Цены от 500₽',
  description: 'Горизонтальные жалюзи на заказ в Санкт-Петербурге. Широкий выбор цветов и материалов. Установка в день заказа. Гарантия качества.',
}

export default async function GorizontalPage({
  searchParams,
}: {
  searchParams: { admin?: string }
}) {
  const data = await getPageBySlug('gorizontal')
  const isAdmin = searchParams.admin === 'true'

  // Если страницы нет в БД, показываем дефолтный контент
  if (!data) {
    return (
      <main className="min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Горизонтальные жалюзи</h1>
            <p className="text-xl">Классические горизонтальные жалюзи для ваших окон</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="prose max-w-none">
            <h2>Описание</h2>
            <p>
              Горизонтальные жалюзи — классическое решение для оформления окон. 
              Подходят для любых помещений и стилей интерьера.
            </p>
            <h2>Цены</h2>
            <p className="text-2xl font-bold text-blue-600">От 500₽ за м²</p>
            <h2>Характеристики</h2>
            <ul>
              <li>Материал: алюминий, пластик</li>
              <li>Ширина ламелей: 16мм, 25мм, 50мм</li>
              <li>Управление: механическое, автоматическое</li>
            </ul>
          </div>
        </div>
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Оставьте заявку</h2>
            <a
              href="#form"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Заказать
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <Editor blocks={data.blocks}>
      <main>
        {data.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </main>
    </Editor>
  )
}

