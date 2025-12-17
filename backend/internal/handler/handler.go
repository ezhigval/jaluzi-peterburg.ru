package handler

import (
	"log/slog"

	"github.com/jaluzi-peterburg/backend/internal/service"
)

type Handler struct {
	pageService  *service.PageService
	blockService *service.BlockService
	leadService  *service.LeadService
	cmsService   *service.CMSService
	authService  *service.AuthService
	log          *slog.Logger
}

func New(
	pageService *service.PageService,
	blockService *service.BlockService,
	leadService *service.LeadService,
	cmsService *service.CMSService,
	authService *service.AuthService,
	log *slog.Logger,
) *Handler {
	return &Handler{
		pageService:  pageService,
		blockService: blockService,
		leadService:  leadService,
		cmsService:   cmsService,
		authService:  authService,
		log:          log,
	}
}

