package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/handler/dto"
	validatorpkg "github.com/jaluzi-peterburg/backend/pkg/validator"
)

func (h *Handler) GetPageBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	page, blocks, err := h.pageService.GetPageBySlug(r.Context(), slug)
	if err != nil {
		h.log.Error("failed to get page", "error", err, "slug", slug)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get page", nil)
		return
	}

	if page == nil {
		h.WriteError(w, http.StatusNotFound, ErrCodeNotFound, "Page not found", nil)
		return
	}

	response := map[string]interface{}{
		"page":   page,
		"blocks": blocks,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) GetPages(w http.ResponseWriter, r *http.Request) {
	pages, err := h.pageService.GetAllPages(r.Context())
	if err != nil {
		h.log.Error("failed to get pages", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get pages", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pages)
}

func (h *Handler) CreatePage(w http.ResponseWriter, r *http.Request) {
	var req dto.CreatePageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	page := req.ToDomain()
	if err := h.pageService.CreatePage(r.Context(), page); err != nil {
		h.log.Error("failed to create page", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to create page", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(page)
}

func (h *Handler) UpdatePage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req dto.UpdatePageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	// Получаем существующую страницу
	pages, err := h.pageService.GetAllPages(r.Context())
	if err != nil {
		h.log.Error("failed to get pages", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get page", nil)
		return
	}

	var page *domain.Page
	for _, p := range pages {
		if p.ID == id {
			page = p
			break
		}
	}

	if page == nil {
		h.WriteError(w, http.StatusNotFound, ErrCodeNotFound, "Page not found", nil)
		return
	}

	req.UpdateDomain(page)
	if err := h.pageService.UpdatePage(r.Context(), page); err != nil {
		h.log.Error("failed to update page", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to update page", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(page)
}

