package handler

import (
	"encoding/json"
	"net/http"
)

// ErrorResponse стандартный формат ошибки API
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Errors  []string `json:"errors,omitempty"` // Для валидационных ошибок
}

// WriteError записывает стандартизированную ошибку
func (h *Handler) WriteError(w http.ResponseWriter, statusCode int, code, message string, errors []string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := ErrorResponse{
		Code:    code,
		Message: message,
	}

	if len(errors) > 0 {
		response.Errors = errors
	}

	json.NewEncoder(w).Encode(response)
}

// Коды ошибок
const (
	ErrCodeValidation   = "VALIDATION_ERROR"
	ErrCodeNotFound     = "NOT_FOUND"
	ErrCodeUnauthorized = "UNAUTHORIZED"
	ErrCodeInternal     = "INTERNAL_ERROR"
	ErrCodeBadRequest   = "BAD_REQUEST"
)

