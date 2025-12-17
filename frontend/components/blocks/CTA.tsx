interface CTAProps {
  data: {
    title?: string
    buttonText?: string
    buttonLink?: string
  }
}

export function CTA({ data }: CTAProps) {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{data.title || 'Оставьте заявку'}</h2>
        <a
          href={data.buttonLink || '#form'}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {data.buttonText || 'Заказать'}
        </a>
      </div>
    </div>
  )
}

