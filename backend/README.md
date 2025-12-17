# Backend API

Go API для CMS сайта жалюзи.

## Структура

```
/cmd/api          Точка входа
/internal
  /domain         Бизнес-логика (entities)
  /repository     Слой данных
  /service        Use cases
  /handler        HTTP handlers
  /config         Конфигурация
/pkg              Утилиты (database, logger)
/migrations       SQL миграции
```

## Запуск

```bash
# Установить зависимости
go mod download

# Запустить
go run cmd/api/main.go
```

## Миграции

```bash
# Применить
migrate -path migrations -database "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" up

# Откатить
migrate -path migrations -database "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" down
```

## API Endpoints

### Public
- `GET /api/v1/pages` - Список страниц
- `GET /api/v1/pages/{slug}` - Страница по slug
- `POST /api/v1/leads` - Создать лид

### Protected (требует Bearer token)
- `POST /api/v1/pages` - Создать страницу
- `PUT /api/v1/pages/{id}` - Обновить страницу
- `GET /api/v1/blocks?page_id={id}` - Блоки страницы
- `POST /api/v1/blocks` - Создать блок
- `PUT /api/v1/blocks/{id}` - Обновить блок
- `DELETE /api/v1/blocks/{id}` - Удалить блок
- `POST /api/v1/blocks/{id}/publish` - Опубликовать блок
- `GET /api/v1/leads` - Список лидов
- `PUT /api/v1/leads/{id}/status` - Изменить статус лида

### Auth
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/refresh` - Обновить токен

## Тестирование

```bash
go test ./...
```

## Линтинг

```bash
golangci-lint run
```

