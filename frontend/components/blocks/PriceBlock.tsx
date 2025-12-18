interface PriceBlockProps {
  data: {
    priceFrom?: number | string
    currency?: string
    notes?: string
    tiers?: Array<{
      name: string
      price: number | string
      description?: string
    }>
  }
}

export function PriceBlock({ data }: PriceBlockProps) {
  const priceFrom = typeof data.priceFrom === 'number' ? data.priceFrom : parseFloat(data.priceFrom || '0')
  const currency = data.currency || '₽'
  
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Цена от {priceFrom.toLocaleString('ru-RU')} {currency}
          </h2>
          {data.notes && (
            <p className="text-gray-600 text-lg">{data.notes}</p>
          )}
        </div>

        {data.tiers && data.tiers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
            {data.tiers.map((tier, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {typeof tier.price === 'number' 
                    ? `${tier.price.toLocaleString('ru-RU')} ${currency}`
                    : tier.price}
                </div>
                {tier.description && (
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

