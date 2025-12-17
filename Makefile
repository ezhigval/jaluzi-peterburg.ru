.PHONY: dev build test lint clean migrate-up migrate-down docker-up docker-down

# Цвета для вывода
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m

# Переменные
DOCKER_COMPOSE = docker-compose -f deploy/docker-compose.yml

help:
	@echo "$(GREEN)Доступные команды:$(NC)"
	@echo "  make dev           - Запуск всего стека (frontend + backend + postgres)"
	@echo "  make build         - Сборка production"
	@echo "  make test          - Запуск тестов"
	@echo "  make lint          - Линтеры (frontend + backend)"
	@echo "  make clean         - Очистка (node_modules, bin, dist)"
	@echo "  make migrate-up    - Применить миграции БД"
	@echo "  make migrate-down  - Откатить миграции"
	@echo "  make docker-up     - Поднять Docker контейнеры"
	@echo "  make docker-down   - Остановить Docker контейнеры"

# Разработка
dev:
	@echo "$(YELLOW)🚀 Запуск dev окружения...$(NC)"
	@$(DOCKER_COMPOSE) up -d postgres
	@sleep 2
	@echo "$(GREEN)✅ PostgreSQL запущен$(NC)"
	@echo "$(YELLOW)Запуск backend...$(NC)"
	@cd backend && go run cmd/api/main.go &
	@echo "$(YELLOW)Запуск frontend...$(NC)"
	@cd frontend && npm run dev &
	@echo "$(GREEN)✅ Frontend: http://localhost:3000$(NC)"
	@echo "$(GREEN)✅ Backend API: http://localhost:8080$(NC)"

# Сборка
build:
	@echo "$(YELLOW)🔨 Сборка...$(NC)"
	@cd backend && go build -o bin/api cmd/api/main.go
	@cd frontend && npm run build
	@echo "$(GREEN)✅ Сборка завершена$(NC)"

# Тесты
test:
	@echo "$(YELLOW)🧪 Запуск тестов...$(NC)"
	@cd backend && go test ./...
	@cd frontend && npm test
	@echo "$(GREEN)✅ Тесты пройдены$(NC)"

# Линтеры
lint:
	@echo "$(YELLOW)🔍 Линтинг...$(NC)"
	@cd backend && golangci-lint run
	@cd frontend && npm run lint
	@echo "$(GREEN)✅ Линтинг завершён$(NC)"

# Очистка
clean:
	@echo "$(YELLOW)🧹 Очистка...$(NC)"
	@rm -rf frontend/node_modules frontend/.next frontend/dist
	@rm -rf backend/bin backend/dist
	@echo "$(GREEN)✅ Очистка завершена$(NC)"

# Миграции
migrate-up:
	@echo "$(YELLOW)📦 Применение миграций...$(NC)"
	@cd backend && migrate -path migrations -database "postgresql://$$POSTGRES_USER:$$POSTGRES_PASSWORD@$$POSTGRES_HOST:$$POSTGRES_PORT/$$POSTGRES_DB?sslmode=$$POSTGRES_SSLMODE" up
	@echo "$(GREEN)✅ Миграции применены$(NC)"

migrate-down:
	@echo "$(YELLOW)📦 Откат миграций...$(NC)"
	@cd backend && migrate -path migrations -database "postgresql://$$POSTGRES_USER:$$POSTGRES_PASSWORD@$$POSTGRES_HOST:$$POSTGRES_PORT/$$POSTGRES_DB?sslmode=$$POSTGRES_SSLMODE" down
	@echo "$(GREEN)✅ Миграции откачены$(NC)"

# Docker
docker-up:
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Docker контейнеры запущены$(NC)"

docker-down:
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Docker контейнеры остановлены$(NC)"

