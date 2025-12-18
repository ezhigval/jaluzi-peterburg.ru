package repository

import (
	"context"

	"github.com/jaluzi-peterburg/backend/internal/domain"
)

type PageRepository interface {
	GetBySlug(ctx context.Context, slug string) (*domain.Page, error)
	GetAll(ctx context.Context) ([]*domain.Page, error)
	Create(ctx context.Context, page *domain.Page) error
	Update(ctx context.Context, page *domain.Page) error
}

type BlockRepository interface {
	GetByPageID(ctx context.Context, pageID string) ([]*domain.ContentBlock, error)
	GetByID(ctx context.Context, id string) (*domain.ContentBlock, error)
	Create(ctx context.Context, block *domain.ContentBlock) error
	Update(ctx context.Context, block *domain.ContentBlock) error
	Delete(ctx context.Context, id string) error
}

type BlockVersionRepository interface {
	SaveVersion(ctx context.Context, version *domain.BlockVersion) error
	GetVersions(ctx context.Context, blockID string) ([]*domain.BlockVersion, error)
	GetVersion(ctx context.Context, blockID string, version int) (*domain.BlockVersion, error)
}

type LeadRepository interface {
	Create(ctx context.Context, lead *domain.Lead) error
	GetAll(ctx context.Context) ([]*domain.Lead, error)
	UpdateStatus(ctx context.Context, id, status string) error
}

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Create(ctx context.Context, user *domain.User) error
}

type AuditRepository interface {
	Log(ctx context.Context, userID, action, entityType, entityID string, changes interface{}) error
}

