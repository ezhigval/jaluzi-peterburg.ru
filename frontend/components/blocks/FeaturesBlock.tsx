interface FeatureItem {
  title: string
  description?: string
  icon?: string
}

interface FeaturesBlockProps {
  data: {
    title?: string
    items?: FeatureItem[]
    columns?: number
  }
}

export function FeaturesBlock({ data }: FeaturesBlockProps) {
  const items = data.items || []
  const columns = data.columns || 3
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-3'
  
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {data.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
        )}
        
        <div className={`grid ${gridCols} gap-6`}>
          {items.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {item.icon && (
                <div className="text-4xl mb-4">{item.icon}</div>
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500">Преимущества не добавлены</p>
        )}
      </div>
    </div>
  )
}

