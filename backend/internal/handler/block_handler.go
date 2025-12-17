package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

func (h *Handler) GetBlocks(w http.ResponseWriter, r *http.Request) {
	pageID := r.URL.Query().Get("page_id")
	if pageID == "" {
		http.Error(w, "page_id is required", http.StatusBadRequest)
		return
	}

	blocks, err := h.blockService.GetBlocks(r.Context(), pageID)
	if err != nil {
		h.log.Error("failed to get blocks", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blocks)
}

func (h *Handler) CreateBlock(w http.ResponseWriter, r *http.Request) {
	var block domain.ContentBlock
	if err := json.NewDecoder(r.Body).Decode(&block); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.blockService.CreateBlock(r.Context(), &block); err != nil {
		h.log.Error("failed to create block", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(block)
}

func (h *Handler) UpdateBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var block domain.ContentBlock
	if err := json.NewDecoder(r.Body).Decode(&block); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	block.ID = id

	if err := h.blockService.UpdateBlock(r.Context(), &block); err != nil {
		h.log.Error("failed to update block", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(block)
}

func (h *Handler) DeleteBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.blockService.DeleteBlock(r.Context(), id); err != nil {
		h.log.Error("failed to delete block", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) PublishBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.blockService.PublishBlock(r.Context(), id); err != nil {
		h.log.Error("failed to publish block", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

