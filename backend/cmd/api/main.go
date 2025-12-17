package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jaluzi-peterburg/backend/internal/config"
	"github.com/jaluzi-peterburg/backend/internal/handler"
	"github.com/jaluzi-peterburg/backend/internal/repository/postgres"
	"github.com/jaluzi-peterburg/backend/internal/service"
	"github.com/jaluzi-peterburg/backend/pkg/database"
	"github.com/jaluzi-peterburg/backend/pkg/logger"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.Load()
	if err != nil {
		slog.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	// Инициализация логгера
	log := logger.New(cfg.Env)

	// Подключение к БД
	db, err := database.Connect(cfg.Database)
	if err != nil {
		log.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	log.Info("database connected successfully")

	// Репозитории
	pageRepo := postgres.NewPageRepository(db)
	blockRepo := postgres.NewBlockRepository(db)
	leadRepo := postgres.NewLeadRepository(db)
	userRepo := postgres.NewUserRepository(db)

	// Сервисы
	pageService := service.NewPageService(pageRepo, blockRepo)
	blockService := service.NewBlockService(blockRepo)
	leadService := service.NewLeadService(leadRepo, cfg)
	cmsService := service.NewCMSService(pageRepo, blockRepo)
	authService := service.NewAuthService(userRepo, cfg.JWT)

	// Handlers
	h := handler.New(
		pageService,
		blockService,
		leadService,
		cmsService,
		authService,
		log,
	)

	// Роутер
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.FrontendURL},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// API routes
	r.Route("/api/v1", func(r chi.Router) {
		// Public
		r.Get("/pages", h.GetPages)
		r.Get("/pages/{slug}", h.GetPageBySlug)
		r.Post("/leads", h.CreateLead)

		// Protected (admin)
		r.Group(func(r chi.Router) {
			r.Use(h.AuthMiddleware)
			r.Post("/pages", h.CreatePage)
			r.Put("/pages/{id}", h.UpdatePage)
			r.Get("/blocks", h.GetBlocks)
			r.Post("/blocks", h.CreateBlock)
			r.Put("/blocks/{id}", h.UpdateBlock)
			r.Delete("/blocks/{id}", h.DeleteBlock)
			r.Post("/blocks/{id}/publish", h.PublishBlock)
			r.Get("/leads", h.GetLeads)
			r.Put("/leads/{id}/status", h.UpdateLeadStatus)
		})

		// Auth
		r.With(h.RateLimitMiddleware).Post("/auth/login", h.Login)
		r.Post("/auth/logout", h.Logout)
		r.Post("/auth/refresh", h.RefreshToken)
		r.Get("/auth/me", h.AuthMe)
	})

	// HTTP сервер
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		log.Info("server starting", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	// Ожидание сигнала для graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("server shutting down")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Error("server forced to shutdown", "error", err)
	}

	log.Info("server exited")
}

