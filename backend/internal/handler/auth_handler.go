package handler

import (
	"encoding/json"
	"net/http"

	"github.com/jaluzi-peterburg/backend/internal/handler/dto"
	validatorpkg "github.com/jaluzi-peterburg/backend/pkg/validator"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	token, user, err := h.authService.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		h.log.Warn("failed login attempt", "email", req.Email, "error", err)
		h.WriteError(w, http.StatusUnauthorized, ErrCodeUnauthorized, "Invalid credentials", nil)
		return
	}

	h.log.Info("successful login", "email", req.Email, "user_id", user.ID)

	// Устанавливаем httpOnly cookie с токеном (сессия на 7 дней)
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		MaxAge:   7 * 24 * 3600, // 7 дней
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil, // true в production с HTTPS
	})

	// Возвращаем только user (без токена)
	response := map[string]interface{}{
		"user": user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	// Удаляем cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "logged out"})
}

func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	// TODO: реализовать refresh token
	h.WriteError(w, http.StatusNotImplemented, ErrCodeBadRequest, "Not implemented", nil)
}
