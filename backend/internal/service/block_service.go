package service

import (
	"context"

	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type BlockService struct {
	blockRepo        repository.BlockRepository
	blockVersionRepo repository.BlockVersionRepository
	auditRepo        repository.AuditRepository
}

func NewBlockService(blockRepo repository.BlockRepository, blockVersionRepo repository.BlockVersionRepository, auditRepo repository.AuditRepository) *BlockService {
	return &BlockService{
		blockRepo:        blockRepo,
		blockVersionRepo: blockVersionRepo,
		auditRepo:        auditRepo,
	}
}

func (s *BlockService) GetBlocks(ctx context.Context, pageID string) ([]*domain.ContentBlock, error) {
	return s.blockRepo.GetByPageID(ctx, pageID)
}

func (s *BlockService) CreateBlock(ctx context.Context, block *domain.ContentBlock, userID string) error {
	if block.Version == 0 {
		block.Version = 1
	}
	if block.Status == "" {
		block.Status = "draft"
	}
	if err := s.blockRepo.Create(ctx, block); err != nil {
		return err
	}

	// Логируем в audit log
	s.auditRepo.Log(ctx, userID, "create_block", "content_block", block.ID, nil)

	return nil
}

func (s *BlockService) UpdateBlock(ctx context.Context, block *domain.ContentBlock, userID string) error {
	// Получаем текущую версию блока перед обновлением
	oldBlock, err := s.blockRepo.GetByID(ctx, block.ID)
	if err != nil {
		return err
	}
	if oldBlock == nil {
		return nil // блок не найден
	}

	// Сохраняем предыдущую версию
	version := &domain.BlockVersion{
		BlockID:   oldBlock.ID,
		Version:   oldBlock.Version,
		Type:      oldBlock.Type,
		Order:     oldBlock.Order,
		Data:      oldBlock.Data,
		Status:    oldBlock.Status,
		CreatedBy: userID,
	}
	if err := s.blockVersionRepo.SaveVersion(ctx, version); err != nil {
		// Логируем ошибку, но не прерываем обновление
		// TODO: использовать logger
	}

	// Обновляем блок (версия увеличится автоматически в репозитории)
	if err := s.blockRepo.Update(ctx, block); err != nil {
		return err
	}

	// Логируем в audit log
	changes := map[string]interface{}{
		"type":   block.Type,
		"order":  block.Order,
		"status": block.Status,
	}
	s.auditRepo.Log(ctx, userID, "update_block", "content_block", block.ID, changes)

	return nil
}

func (s *BlockService) DeleteBlock(ctx context.Context, id string) error {
	return s.blockRepo.Delete(ctx, id)
}

func (s *BlockService) GetBlockByID(ctx context.Context, id string) (*domain.ContentBlock, error) {
	return s.blockRepo.GetByID(ctx, id)
}

func (s *BlockService) PublishBlock(ctx context.Context, id string, userID string) error {
	block, err := s.blockRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if block == nil {
		return nil // или вернуть ошибку "not found"
	}
	block.Status = "published"
	return s.UpdateBlock(ctx, block, userID)
}

func (s *BlockService) GetBlockVersions(ctx context.Context, blockID string) ([]*domain.BlockVersion, error) {
	return s.blockVersionRepo.GetVersions(ctx, blockID)
}

func (s *BlockService) RestoreBlockVersion(ctx context.Context, blockID string, version int, userID string) error {
	// Получаем версию для восстановления
	versionData, err := s.blockVersionRepo.GetVersion(ctx, blockID, version)
	if err != nil {
		return err
	}
	if versionData == nil {
		return nil // версия не найдена
	}

	// Получаем текущий блок
	block, err := s.blockRepo.GetByID(ctx, blockID)
	if err != nil {
		return err
	}
	if block == nil {
		return nil // блок не найден
	}

	// Восстанавливаем данные из версии
	block.Type = versionData.Type
	block.Order = versionData.Order
	block.Data = versionData.Data
	block.Status = versionData.Status

	// Обновляем блок (создаст новую версию)
	if err := s.UpdateBlock(ctx, block, userID); err != nil {
		return err
	}

	// Логируем откат
	s.auditRepo.Log(ctx, userID, "restore_block_version", "content_block", blockID, map[string]interface{}{
		"restored_version": version,
	})

	return nil
}

