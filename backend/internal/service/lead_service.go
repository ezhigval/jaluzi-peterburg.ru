package service

import (
	"context"
	"fmt"

	"github.com/jaluzi-peterburg/backend/internal/config"
	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type LeadService struct {
	leadRepo repository.LeadRepository
	cfg      *config.Config
}

func NewLeadService(leadRepo repository.LeadRepository, cfg *config.Config) *LeadService {
	return &LeadService{
		leadRepo: leadRepo,
		cfg:      cfg,
	}
}

func (s *LeadService) CreateLead(ctx context.Context, lead *domain.Lead) error {
	lead.Status = "new"
	if err := s.leadRepo.Create(ctx, lead); err != nil {
		return err
	}

	// Отправка уведомления
	go s.notify(lead)

	return nil
}

func (s *LeadService) notify(lead *domain.Lead) {
	// Telegram уведомление
	if s.cfg.Telegram.BotToken != "" && s.cfg.Telegram.ChatID != "" {
		// TODO: реализовать отправку в Telegram
	}

	// Email fallback
	if s.cfg.SMTP.Host != "" {
		// TODO: реализовать отправку email
	}
}

func (s *LeadService) GetAllLeads(ctx context.Context) ([]*domain.Lead, error) {
	return s.leadRepo.GetAll(ctx)
}

func (s *LeadService) UpdateLeadStatus(ctx context.Context, id, status string) error {
	validStatuses := map[string]bool{
		"new": true, "contacted": true, "converted": true, "rejected": true,
	}
	if !validStatuses[status] {
		return fmt.Errorf("invalid status: %s", status)
	}
	return s.leadRepo.UpdateStatus(ctx, id, status)
}

