package dto

import "github.com/jaluzi-peterburg/backend/internal/domain"

// CreatePageRequest запрос на создание страницы
type CreatePageRequest struct {
	Slug           string `json:"slug" validate:"required,min=1,max=255"`
	Title          string `json:"title" validate:"required,min=1,max=255"`
	MetaTitle      string `json:"meta_title,omitempty" validate:"omitempty,max=255"`
	MetaDesc       string `json:"meta_description,omitempty" validate:"omitempty,max=1000"`
	Status         string `json:"status,omitempty" validate:"omitempty,oneof=draft published"`
}

// UpdatePageRequest запрос на обновление страницы
type UpdatePageRequest struct {
	Slug           string `json:"slug" validate:"required,min=1,max=255"`
	Title          string `json:"title" validate:"required,min=1,max=255"`
	MetaTitle      string `json:"meta_title,omitempty" validate:"omitempty,max=255"`
	MetaDesc       string `json:"meta_description,omitempty" validate:"omitempty,max=1000"`
	Status         string `json:"status,omitempty" validate:"omitempty,oneof=draft published"`
}

// ToDomain конвертирует DTO в domain entity
func (r *CreatePageRequest) ToDomain() *domain.Page {
	status := r.Status
	if status == "" {
		status = "draft"
	}
	return &domain.Page{
		Slug:        r.Slug,
		Title:       r.Title,
		MetaTitle:   r.MetaTitle,
		MetaDesc:    r.MetaDesc,
		Status:      status,
	}
}

// UpdateDomain обновляет domain entity из DTO
func (r *UpdatePageRequest) UpdateDomain(page *domain.Page) {
	page.Slug = r.Slug
	page.Title = r.Title
	page.MetaTitle = r.MetaTitle
	page.MetaDesc = r.MetaDesc
	if r.Status != "" {
		page.Status = r.Status
	}
}

