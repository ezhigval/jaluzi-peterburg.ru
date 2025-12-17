# Jaluzi Peterburg — Сайт с inline-CMS

Новый сайт для производства жалюзи в Санкт-Петербурге с визуальным редактором поверх страниц (Figma-like).

## Технологический стек

- **Frontend**: Next.js 14+ (React + TypeScript + TailwindCSS)
- **Backend**: Go 1.22+ (chi router, PostgreSQL)
- **CMS**: Inline-редактор поверх страниц (не отдельная админка)
- **Инфраструктура**: Docker, Nginx, Let's Encrypt
- **База данных**: PostgreSQL 15+

## Быстрый старт

### Предварительные требования

- Go 1.22+
- Node.js 20+
- Docker & docker-compose
- PostgreSQL 15+ (или через Docker)

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/ezhigval/jaluzi-peterburg.ru.git
cd jaluzi-peterburg.ru

# 2. Настроить окружение
cp .env.example .env
# Отредактировать .env (указать JWT_SECRET, пароли БД и т.д.)

# 3. Запустить PostgreSQL
make docker-up
# Или вручную:
docker-compose -f deploy/docker-compose.yml up -d postgres

# 4. Применить миграции
cd backend
migrate -path migrations -database "postgresql://jaluzi:jaluzi_dev_password@localhost:5432/jaluzi_db?sslmode=disable" up

# 5. Запустить backend
cd backend
go mod download
go run cmd/api/main.go

# 6. Запустить frontend (в новом терминале)
cd frontend
npm install
npm run dev
```

### Доступ

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin: http://localhost:3000/admin/login

## Структура

```
/frontend          Next.js приложение
/backend           Go API
/deploy            Docker, Nginx конфиги
/docs              Архитектура, ADR, миграция
/scripts           Утилиты
```

## Команды

```bash
make dev           # Запуск всего стека локально
make build         # Сборка production
make test          # Тесты (frontend + backend)
make lint          # Линтеры
make migrate-up    # Применить миграции БД
make migrate-down  # Откатить миграции
make clean         # Очистка (node_modules, bin, dist)
```

## CI/CD

Проект использует GitHub Actions для автоматической проверки кода:

- **Backend**: `go mod tidy`, `go vet`, `go test`, сборка
- **Frontend**: `npm ci`, линтинг, проверка типов, сборка
- **Docker**: проверка сборки Docker-образов

CI запускается автоматически на:
- Push в `main` и `develop`
- Pull Request в `main` и `develop`

Все проверки должны пройти успешно перед merge PR. Подробнее в [docs/CI.md](./docs/CI.md).

## Документация

- [Архитектура inline-CMS](./docs/ARCHITECTURE.md)
- [ADR решения](./docs/adr/)
- [План миграции](./docs/MIGRATION.md)
- [Руководство администратора](./docs/ADMIN.md)
- [Quick Start Guide](./docs/QUICKSTART.md)

## Разработка

### Code Style

- **Frontend**: ESLint + Prettier (конфиг в `/frontend`)
- **Backend**: `gofmt`, `golangci-lint` (конфиг в `/backend`)
- **Коммиты**: [Conventional Commits](https://www.conventionalcommits.org/)

Подробнее в [CONTRIBUTING.md](./CONTRIBUTING.md)

### Структура проекта

```
/
├── backend/          # Go API
│   ├── cmd/         # Точки входа
│   ├── internal/    # Внутренний код
│   ├── migrations/  # SQL миграции
│   └── pkg/         # Публичные пакеты
├── frontend/         # Next.js приложение
│   ├── app/         # App Router
│   ├── components/  # React компоненты
│   └── lib/         # Утилиты
├── deploy/           # Docker, Nginx конфиги
├── docs/             # Документация
├── scripts/          # Утилиты
└── Makefile          # Команды для разработки
```

## Миграция со старого сайта

См. [docs/MIGRATION.md](./docs/MIGRATION.md)

## Лицензия

Proprietary

