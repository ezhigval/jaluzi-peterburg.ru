'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Критическая ошибка
            </h2>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
