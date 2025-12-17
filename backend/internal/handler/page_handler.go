package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

func (h *Handler) GetPageBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	page, blocks, err := h.pageService.GetPageBySlug(r.Context(), slug)
	if err != nil {
		h.log.Error("failed to get page", "error", err, "slug", slug)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if page == nil {
		http.Error(w, "Page not found", http.StatusNotFound)
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
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pages)
}

func (h *Handler) CreatePage(w http.ResponseWriter, r *http.Request) {
	var page domain.Page
	if err := json.NewDecoder(r.Body).Decode(&page); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if page.Status == "" {
		page.Status = "draft"
	}

	if err := h.pageService.CreatePage(r.Context(), &page); err != nil {
		h.log.Error("failed to create page", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(page)
}

func (h *Handler) UpdatePage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var page domain.Page
	if err := json.NewDecoder(r.Body).Decode(&page); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	page.ID = id

	if err := h.pageService.UpdatePage(r.Context(), &page); err != nil {
		h.log.Error("failed to update page", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(page)
}

