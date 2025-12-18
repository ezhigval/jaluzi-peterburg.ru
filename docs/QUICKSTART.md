# Quick Start Guide

Быстрый запуск проекта для локальной разработки и тестирования.

## Предварительные требования

- Go 1.22+
- Node.js 20+
- Docker Desktop (для PostgreSQL) ИЛИ локальный PostgreSQL 15+
- git

## Шаг 1: Подготовка окружения

```bash
# Клонировать репозиторий
git clone git@github.com:ezhigval/jaluzi-peterburg.ru.git
cd jaluzi-peterburg.ru

# Создать .env файл
cp .env.example .env

# Отредактировать .env (обязательно указать JWT_SECRET и POSTGRES_PASSWORD)
# Для разработки можно использовать:
# JWT_SECRET=dev-secret-key-change-in-production
# POSTGRES_PASSWORD=jaluzi_dev_password
```

## Шаг 2: Запустить PostgreSQL

### Вариант A: Через Docker (рекомендуется)

```bash
# Запустить PostgreSQL
docker-compose -f deploy/docker-compose.yml up -d postgres

# Подождать несколько секунд пока PostgreSQL запустится
sleep 5
```

### Вариант B: Локальный PostgreSQL

Убедитесь, что PostgreSQL запущен и доступен на `localhost:5432`.

## Шаг 3: Применить миграции

```bash
cd backend

# Если используете migrate CLI
migrate -path migrations \
  -database "postgresql://jaluzi:jaluzi_dev_password@localhost:5432/jaluzi_db?sslmode=disable" \
  up

# Или через psql напрямую
psql -h localhost -U jaluzi -d jaluzi_db -f migrations/001_initial_schema.up.sql
psql -h localhost -U jaluzi -d jaluzi_db -f migrations/002_seed_pages.up.sql
psql -h localhost -U jaluzi -d jaluzi_db -f migrations/003_block_versions.up.sql
```

Миграции создадут:
- Таблицы (pages, content_blocks, leads, users, audit_logs, block_versions)
- Базовые страницы с контентом
- Индексы

## Шаг 4: Создать администратора

```bash
# Вариант 1: Использовать скрипт (требует Node.js)
chmod +x scripts/create-admin.sh
./scripts/create-admin.sh

# Вариант 2: Вручную через psql
psql -h localhost -U jaluzi -d jaluzi_db

# В psql выполнить (замените на реальный bcrypt hash):
INSERT INTO users (id, email, password_hash, role) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- пароль: secret
  'admin'
);
```

**Генерация bcrypt hash:**
- Через Node.js: `node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(h => console.log(h));"`
- Или использовать онлайн генератор: https://bcrypt-generator.com/

## Шаг 5: Запустить Backend

```bash
cd backend

# Установить зависимости (если еще не установлены)
go mod download

# Запустить
go run cmd/api/main.go
```

Backend запустится на `http://localhost:8080`

Проверить: `curl http://localhost:8080/health` должен вернуть `OK`

## Шаг 6: Запустить Frontend

В новом терминале:

```bash
cd frontend

# Установить зависимости (если еще не установлены)
npm install

# Запустить dev сервер
npm run dev
```

Frontend запустится на `http://localhost:3000`

## Шаг 7: Проверка

### Основные страницы
- `http://localhost:3000/` — главная
- `http://localhost:3000/gorizontal` — страница услуги

### Admin режим
- `http://localhost:3000/admin/login` — вход
- После входа: `http://localhost:3000/gorizontal/admin` — редактирование

### API
- `http://localhost:8080/api/v1/pages` — список страниц
- `http://localhost:8080/health` — health check

## Проблемы и решения

### Ошибка: "POSTGRES_PASSWORD is required"
Убедитесь, что в `.env` файле указан `POSTGRES_PASSWORD`.

### Ошибка: "JWT_SECRET is required"
Убедитесь, что в `.env` файле указан `JWT_SECRET`.

### Ошибка подключения к БД
- Проверьте, что PostgreSQL запущен
- Проверьте параметры подключения в `.env`
- Проверьте, что порт 5432 не занят другим процессом

### Frontend не собирается
- Убедитесь, что `npm install` выполнен
- Проверьте версию Node.js (должна быть 20+)

## Следующие шаги

После успешного запуска:
1. Проверить все страницы
2. Протестировать admin режим
3. Отправить тестовую заявку
4. Проверить admin панель лидов

## Остановка

```bash
# Остановить backend: Ctrl+C в терминале

# Остановить frontend: Ctrl+C в терминале

# Остановить PostgreSQL (если через Docker)
docker-compose -f deploy/docker-compose.yml down
```
