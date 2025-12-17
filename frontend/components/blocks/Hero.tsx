interface HeroProps {
  data: {
    title?: string
    subtitle?: string
    image?: string
  }
}

export function Hero({ data }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">{data.title || 'Заголовок'}</h1>
        {data.subtitle && <p className="text-xl">{data.subtitle}</p>}
      </div>
    </div>
  )
}

