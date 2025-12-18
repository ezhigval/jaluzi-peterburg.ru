interface GalleryImage {
  url: string
  caption?: string
  alt?: string
}

interface GalleryBlockProps {
  data: {
    title?: string
    images?: GalleryImage[]
    columns?: number
  }
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const images = data.images || []
  const columns = data.columns || 3
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns] || 'grid-cols-2 md:grid-cols-3'
  
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {data.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
        )}
        
        <div className={`grid ${gridCols} gap-4`}>
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.alt || image.caption || `Изображение ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {image.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-center text-gray-500">Изображения не добавлены</p>
        )}
      </div>
    </div>
  )
}

