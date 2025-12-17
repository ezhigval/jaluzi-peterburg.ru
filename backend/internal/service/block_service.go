package service

import (
	"context"

	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type BlockService struct {
	blockRepo repository.BlockRepository
}

func NewBlockService(blockRepo repository.BlockRepository) *BlockService {
	return &BlockService{blockRepo: blockRepo}
}

func (s *BlockService) GetBlocks(ctx context.Context, pageID string) ([]*domain.ContentBlock, error) {
	return s.blockRepo.GetByPageID(ctx, pageID)
}

func (s *BlockService) CreateBlock(ctx context.Context, block *domain.ContentBlock) error {
	if block.Version == 0 {
		block.Version = 1
	}
	if block.Status == "" {
		block.Status = "draft"
	}
	return s.blockRepo.Create(ctx, block)
}

func (s *BlockService) UpdateBlock(ctx context.Context, block *domain.ContentBlock) error {
	return s.blockRepo.Update(ctx, block)
}

func (s *BlockService) DeleteBlock(ctx context.Context, id string) error {
	return s.blockRepo.Delete(ctx, id)
}

func (s *BlockService) PublishBlock(ctx context.Context, id string) error {
	block, err := s.blockRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	block.Status = "published"
	return s.blockRepo.Update(ctx, block)
}

