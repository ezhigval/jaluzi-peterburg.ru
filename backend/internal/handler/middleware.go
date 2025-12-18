package handler

import (
	"net/http"
	"strings"
)

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var token string

		// Сначала пробуем получить токен из cookie
		cookie, err := r.Cookie("auth_token")
		if err == nil && cookie.Value != "" {
			token = cookie.Value
		} else {
			// Fallback на Authorization header (для обратной совместимости)
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && parts[0] == "Bearer" {
					token = parts[1]
				}
			}
		}

		if token == "" {
			h.WriteError(w, http.StatusUnauthorized, ErrCodeUnauthorized, "Authorization required", nil)
			return
		}

		userID, role, err := h.authService.ValidateToken(token)
		if err != nil {
			h.WriteError(w, http.StatusUnauthorized, ErrCodeUnauthorized, "Invalid token", nil)
			return
		}

		// Добавляем userID и role в контекст (через headers для передачи)
		r.Header.Set("X-User-ID", userID)
		r.Header.Set("X-User-Role", role)

		next.ServeHTTP(w, r)
	})
}
