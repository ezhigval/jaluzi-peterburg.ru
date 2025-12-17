# Быстрый старт

## Предварительные требования

- Go 1.22+
- Node.js 20+
- Docker & docker-compose
- PostgreSQL 15+ (или через Docker)

## Локальная разработка

### 1. Клонировать и настроить

```bash
cd jaluzi-peterburg.ru
cp .env.example .env
# Отредактировать .env (указать JWT_SECRET, пароли БД и т.д.)
```

### 2. Запустить PostgreSQL

```bash
make docker-up
# Или вручную:
docker-compose -f deploy/docker-compose.yml up -d postgres
```

### 3. Применить миграции

```bash
cd backend
migrate -path migrations -database "postgresql://jaluzi:jaluzi_dev_password@localhost:5432/jaluzi_db?sslmode=disable" up
```

### 4. Запустить backend

```bash
cd backend
go mod download
go run cmd/api/main.go
```

Backend будет доступен на `http://localhost:8080`

### 5. Запустить frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

### 6. Создать первого админа

```sql
-- Подключиться к БД
psql -U jaluzi -d jaluzi_db

-- Создать админа (пароль: admin123, хеш bcrypt)
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@example.com', '$2a$10$...', 'admin');
```

Или использовать скрипт (TODO: создать).

### 7. Создать тестовую страницу

```bash
# Через API
curl -X POST http://localhost:8080/api/v1/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "slug": "gorizontal",
    "title": "Горизонтальные жалюзи",
    "meta_title": "Горизонтальные жалюзи в СПб",
    "meta_description": "Описание",
    "status": "published"
  }'
```

### 8. Открыть страницу

- Обычный режим: `http://localhost:3000/gorizontal`
- Админ-режим: `http://localhost:3000/gorizontal/admin`

## Использование Makefile

```bash
make dev          # Запустить всё (frontend + backend + postgres)
make build        # Сборка production
make test         # Тесты
make lint         # Линтеры
make migrate-up   # Применить миграции
```

## Troubleshooting

### Backend не подключается к БД

Проверьте:
- PostgreSQL запущен
- Правильные credentials в `.env`
- Миграции применены

### Frontend не видит API

Проверьте:
- `NEXT_PUBLIC_API_URL` в `.env`
- CORS настройки в backend
- Backend запущен

### Админка не работает

Проверьте:
- Авторизованы ли вы (токен в localStorage)
- Токен валидный
- Backend API доступен

