package handler

import (
	"encoding/csv"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/handler/dto"
	validatorpkg "github.com/jaluzi-peterburg/backend/pkg/validator"
)

func (h *Handler) CreateLead(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateLeadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	lead := req.ToDomain()
	if err := h.leadService.CreateLead(r.Context(), lead); err != nil {
		h.log.Error("failed to create lead", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to create lead", nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(lead)
}

func (h *Handler) GetLeads(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status") // Фильтр по статусу
	
	leads, err := h.leadService.GetAllLeads(r.Context())
	if err != nil {
		h.log.Error("failed to get leads", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get leads", nil)
		return
	}

	// Фильтрация по статусу
	if status != "" {
		filtered := make([]*domain.Lead, 0)
		for _, lead := range leads {
			if lead.Status == status {
				filtered = append(filtered, lead)
			}
		}
		leads = filtered
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leads)
}

func (h *Handler) UpdateLeadStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req struct {
		Status string `json:"status" validate:"required,oneof=new contacted converted rejected"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.WriteError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	if validationErrors := validatorpkg.ValidateStruct(&req); len(validationErrors) > 0 {
		h.WriteError(w, http.StatusBadRequest, ErrCodeValidation, "Validation failed", validationErrors)
		return
	}

	if err := h.leadService.UpdateLeadStatus(r.Context(), id, req.Status); err != nil {
		h.log.Error("failed to update lead status", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to update lead status", nil)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) ExportLeadsCSV(w http.ResponseWriter, r *http.Request) {
	leads, err := h.leadService.GetAllLeads(r.Context())
	if err != nil {
		h.log.Error("failed to get leads", "error", err)
		h.WriteError(w, http.StatusInternalServerError, ErrCodeInternal, "Failed to get leads", nil)
		return
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=leads.csv")

	writer := csv.NewWriter(w)
	defer writer.Flush()

	// Заголовки
	headers := []string{"ID", "Имя", "Телефон", "Email", "Сообщение", "Страница", "Статус", "Дата создания"}
	if err := writer.Write(headers); err != nil {
		h.log.Error("failed to write CSV header", "error", err)
		return
	}

	// Данные
	for _, lead := range leads {
		record := []string{
			lead.ID,
			lead.Name,
			lead.Phone,
			lead.Email,
			lead.Message,
			lead.PageURL,
			lead.Status,
			lead.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		if err := writer.Write(record); err != nil {
			h.log.Error("failed to write CSV record", "error", err)
			return
		}
	}
}

