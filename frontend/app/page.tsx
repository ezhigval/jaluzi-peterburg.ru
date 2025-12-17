import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Жалюзи в Санкт-Петербурге</h1>
        <p className="text-lg mb-8">
          Производство и установка жалюзи. Высокое качество, доступные цены.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/gorizontal" className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Горизонтальные</h2>
            <p>Классические горизонтальные жалюзи</p>
          </Link>
          <Link href="/vertical" className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Вертикальные</h2>
            <p>Вертикальные жалюзи для больших окон</p>
          </Link>
          <Link href="/rimskye" className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Римские</h2>
            <p>Элегантные римские шторы</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

