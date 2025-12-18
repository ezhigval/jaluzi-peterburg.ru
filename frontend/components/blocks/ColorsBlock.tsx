interface ColorItem {
  name: string
  image?: string
  hex?: string
}

interface ColorsBlockProps {
  data: {
    title?: string
    colors?: ColorItem[]
  }
}

export function ColorsBlock({ data }: ColorsBlockProps) {
  const colors = data.colors || []
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {data.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {color.image ? (
                <div className="aspect-square">
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : color.hex ? (
                <div
                  className="aspect-square"
                  style={{ backgroundColor: color.hex }}
                />
              ) : (
                <div className="aspect-square bg-gray-200" />
              )}
              <div className="p-3 text-center">
                <p className="text-sm font-medium text-gray-900">{color.name}</p>
              </div>
            </div>
          ))}
        </div>

        {colors.length === 0 && (
          <p className="text-center text-gray-500">Цвета не добавлены</p>
        )}
      </div>
    </div>
  )
}

