package service

import (
	"context"

	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type PageService struct {
	pageRepo  repository.PageRepository
	blockRepo repository.BlockRepository
}

func NewPageService(pageRepo repository.PageRepository, blockRepo repository.BlockRepository) *PageService {
	return &PageService{
		pageRepo:  pageRepo,
		blockRepo: blockRepo,
	}
}

func (s *PageService) GetPageBySlug(ctx context.Context, slug string) (*domain.Page, []*domain.ContentBlock, error) {
	page, err := s.pageRepo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, nil, err
	}
	if page == nil {
		return nil, nil, nil
	}

	blocks, err := s.blockRepo.GetByPageID(ctx, page.ID)
	if err != nil {
		return nil, nil, err
	}

	return page, blocks, nil
}

func (s *PageService) GetAllPages(ctx context.Context) ([]*domain.Page, error) {
	return s.pageRepo.GetAll(ctx)
}

func (s *PageService) CreatePage(ctx context.Context, page *domain.Page) error {
	return s.pageRepo.Create(ctx, page)
}

func (s *PageService) UpdatePage(ctx context.Context, page *domain.Page) error {
	return s.pageRepo.Update(ctx, page)
}

