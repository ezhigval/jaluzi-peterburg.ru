package cors

import (
	"net/http"
)

// CORS middleware для обработки CORS запросов
func Middleware(allowedOrigins []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			
			// Всегда добавляем CORS заголовки для разрешенных origins
			if origin != "" {
				allowed := false
				for _, allowedOrigin := range allowedOrigins {
					if origin == allowedOrigin {
						allowed = true
						break
					}
				}
				
				// В dev режиме разрешаем localhost:3000
				if !allowed && origin == "http://localhost:3000" {
					allowed = true
				}
				
				if allowed {
					w.Header().Set("Access-Control-Allow-Origin", origin)
					w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
					w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-Requested-With")
					w.Header().Set("Access-Control-Allow-Credentials", "true")
					w.Header().Set("Access-Control-Max-Age", "300")
					w.Header().Set("Access-Control-Expose-Headers", "Link")
				}
			}
			
			// Обрабатываем preflight запрос
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	}
}

