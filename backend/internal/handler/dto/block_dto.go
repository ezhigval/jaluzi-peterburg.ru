package dto

import "github.com/jaluzi-peterburg/backend/internal/domain"

// CreateBlockRequest запрос на создание блока
type CreateBlockRequest struct {
	PageID string                 `json:"page_id" validate:"required,uuid"`
	Type   string                 `json:"type" validate:"required,min=1,max=50"`
	Order  int                    `json:"order" validate:"required,min=0"`
	Data   map[string]interface{} `json:"data" validate:"required"`
	Status string                 `json:"status,omitempty" validate:"omitempty,oneof=draft published"`
}

// UpdateBlockRequest запрос на обновление блока
type UpdateBlockRequest struct {
	Type   string                 `json:"type" validate:"required,min=1,max=50"`
	Order  int                    `json:"order" validate:"required,min=0"`
	Data   map[string]interface{} `json:"data" validate:"required"`
	Status string                 `json:"status,omitempty" validate:"omitempty,oneof=draft published"`
}

// ToDomain конвертирует DTO в domain entity
func (r *CreateBlockRequest) ToDomain() *domain.ContentBlock {
	status := r.Status
	if status == "" {
		status = "draft"
	}
	return &domain.ContentBlock{
		PageID: r.PageID,
		Type:   r.Type,
		Order:  r.Order,
		Data:   r.Data,
		Status: status,
	}
}

// UpdateDomain обновляет domain entity из DTO
func (r *UpdateBlockRequest) UpdateDomain(block *domain.ContentBlock) {
	block.Type = r.Type
	block.Order = r.Order
	block.Data = r.Data
	if r.Status != "" {
		block.Status = r.Status
	}
}

