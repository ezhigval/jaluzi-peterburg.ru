package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaluzi-peterburg/backend/internal/handler/dto"
	validatorpkg "github.com/jaluzi-peterburg/backend/pkg/validator"
)

func (h *Handler) GetBlocks(w http.ResponseWriter, r *http.Request) {
	pageID := r.URL.Query().Get("page_id")
	if pageID == "" {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "page_id is required", nil)
		return
	}

	blocks, err := h.blockService.GetBlocks(r.Context(), pageID)
	if err != nil {
		h.log.Error("failed to get blocks", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get blocks", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blocks)
}

func (h *Handler) CreateBlock(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateBlockRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	block := req.ToDomain()
	userID := r.Header.Get("X-User-ID")
	if err := h.blockService.CreateBlock(r.Context(), block, userID); err != nil {
		h.log.Error("failed to create block", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to create block", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(block)
}

func (h *Handler) UpdateBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req dto.UpdateBlockRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	// Получаем существующий блок
	block, err := h.blockService.GetBlockByID(r.Context(), id)
	if err != nil {
		h.log.Error("failed to get block", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get block", nil)
		return
	}

	if block == nil {
		h.WriteError(w, http.StatusNotFound, ErrCodeNotFound, "Block not found", nil)
		return
	}

	req.UpdateDomain(block)
	userID := r.Header.Get("X-User-ID")
	if err := h.blockService.UpdateBlock(r.Context(), block, userID); err != nil {
		h.log.Error("failed to update block", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to update block", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(block)
}

func (h *Handler) DeleteBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.blockService.DeleteBlock(r.Context(), id); err != nil {
		h.log.Error("failed to delete block", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to delete block", nil)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) PublishBlock(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	userID := r.Header.Get("X-User-ID")

	if err := h.blockService.PublishBlock(r.Context(), id, userID); err != nil {
		h.log.Error("failed to publish block", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to publish block", nil)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) GetBlockVersions(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	versions, err := h.blockService.GetBlockVersions(r.Context(), id)
	if err != nil {
		h.log.Error("failed to get block versions", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get block versions", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(versions)
}

func (h *Handler) RestoreBlockVersion(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	userID := r.Header.Get("X-User-ID")

	var req struct {
		Version int `json:"version"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if err := h.blockService.RestoreBlockVersion(r.Context(), id, req.Version, userID); err != nil {
		h.log.Error("failed to restore block version", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to restore block version", nil)
		return
	}

	w.WriteHeader(http.StatusOK)
}

