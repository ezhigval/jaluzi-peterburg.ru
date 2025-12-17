package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

func (h *Handler) AuthMe(w http.ResponseWriter, r *http.Request) {
	var token string

	// Получаем токен из cookie
	cookie, err := r.Cookie("auth_token")
	if err == nil && cookie.Value != "" {
		token = cookie.Value
	} else {
		// Fallback на Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				token = parts[1]
			}
		}
	}

	if token == "" {
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	userID, role, err := h.authService.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// TODO: получать полную информацию о пользователе из БД
	response := map[string]interface{}{
		"id":    userID,
		"role":  role,
		"email": "", // TODO: получить из БД
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

