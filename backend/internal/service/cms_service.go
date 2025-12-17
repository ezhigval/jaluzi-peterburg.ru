package service

import (
	"context"

	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type CMSService struct {
	pageRepo  repository.PageRepository
	blockRepo repository.BlockRepository
}

func NewCMSService(pageRepo repository.PageRepository, blockRepo repository.BlockRepository) *CMSService {
	return &CMSService{
		pageRepo:  pageRepo,
		blockRepo: blockRepo,
	}
}

// Публикует все draft блоки страницы
func (s *CMSService) PublishPage(ctx context.Context, pageID string) error {
	blocks, err := s.blockRepo.GetByPageID(ctx, pageID)
	if err != nil {
		return err
	}

	for _, block := range blocks {
		if block.Status == "draft" {
			block.Status = "published"
			if err := s.blockRepo.Update(ctx, block); err != nil {
				return err
			}
		}
	}

	return nil
}

