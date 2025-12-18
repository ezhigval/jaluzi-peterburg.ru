package dto

import "github.com/jaluzi-peterburg/backend/internal/domain"

// CreateLeadRequest запрос на создание лида
type CreateLeadRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=255"`
	Phone   string `json:"phone" validate:"required,min=5,max=50"`
	Email   string `json:"email,omitempty" validate:"omitempty,email,max=255"`
	Message string `json:"message,omitempty" validate:"omitempty,max=2000"`
	PageURL string `json:"page_url,omitempty" validate:"omitempty,url,max=500"`
}

// ToDomain конвертирует DTO в domain entity
func (r *CreateLeadRequest) ToDomain() *domain.Lead {
	return &domain.Lead{
		Name:    r.Name,
		Phone:   r.Phone,
		Email:   r.Email,
		Message: r.Message,
		PageURL: r.PageURL,
	}
}

