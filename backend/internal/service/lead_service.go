package service

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jaluzi-peterburg/backend/internal/config"
	"github.com/jaluzi-peterburg/backend/internal/domain"
	"github.com/jaluzi-peterburg/backend/internal/notification"
	"github.com/jaluzi-peterburg/backend/internal/repository"
)

type LeadService struct {
	leadRepo        repository.LeadRepository
	cfg             *config.Config
	telegramNotif   *notification.TelegramNotifier
	emailNotif      *notification.EmailNotifier
	logger          *slog.Logger
}

func NewLeadService(leadRepo repository.LeadRepository, cfg *config.Config, logger *slog.Logger) *LeadService {
	telegramNotif := notification.NewTelegramNotifier(cfg.Telegram.BotToken, cfg.Telegram.ChatID)
	emailNotif := notification.NewEmailNotifier(
		cfg.SMTP.Host,
		cfg.SMTP.Port,
		cfg.SMTP.User,
		cfg.SMTP.Password,
		cfg.SMTP.From,
	)

	return &LeadService{
		leadRepo:      leadRepo,
		cfg:           cfg,
		telegramNotif: telegramNotif,
		emailNotif:    emailNotif,
		logger:        logger,
	}
}

func (s *LeadService) CreateLead(ctx context.Context, lead *domain.Lead) error {
	lead.Status = "new"
	if err := s.leadRepo.Create(ctx, lead); err != nil {
		return err
	}

	// Отправка уведомления асинхронно
	go s.notify(lead)

	return nil
}

func (s *LeadService) notify(lead *domain.Lead) {
	// Форматируем сообщение
	telegramText := notification.FormatLeadMessage(
		lead.Name,
		lead.Phone,
		lead.Email,
		lead.Message,
		lead.PageURL,
	)

	emailHTML := notification.FormatLeadEmailHTML(
		lead.Name,
		lead.Phone,
		lead.Email,
		lead.Message,
		lead.PageURL,
	)

	// Отправка в Telegram (основной канал)
	if err := s.telegramNotif.SendMessage(telegramText); err != nil {
		s.logger.Error("failed to send telegram notification", "error", err)
		// Fallback на email
		if err := s.emailNotif.SendEmail(
			s.cfg.SMTP.From, // Отправляем на адрес из конфига (можно сделать отдельный адрес для уведомлений)
			"Новая заявка: "+lead.Name,
			emailHTML,
		); err != nil {
			s.logger.Error("failed to send email notification", "error", err)
		}
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

