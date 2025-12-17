interface TextProps {
  data: {
    content?: string
  }
}

export function Text({ data }: TextProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose max-w-none">
        <p>{data.content || 'Текстовый блок'}</p>
      </div>
    </div>
  )
}

