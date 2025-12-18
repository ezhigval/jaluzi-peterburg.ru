# ЭТАП 6: Версионирование и аудит — REVIEW

## Цель
Безопасное редактирование контента. История изменений блока, возможность отката, audit log (кто что когда).

## Выполнено

### 1. Миграция БД: block_versions ✅
- ✅ Таблица `block_versions` для истории изменений
- ✅ Поля: id, block_id, version, type, order_index, data, status, created_at, created_by
- ✅ Индексы для быстрого поиска

**Файлы:**
- `backend/migrations/003_block_versions.up.sql`
- `backend/migrations/003_block_versions.down.sql`

### 2. Backend: Сохранение версий при обновлении ✅
- ✅ При обновлении блока сохраняется предыдущая версия
- ✅ Версия сохраняется перед увеличением version в блоке
- ✅ Связано с userID (кто создал версию)

**Обновлено:**
- `backend/internal/service/block_service.go` — метод `UpdateBlock` теперь сохраняет версию
- `backend/internal/repository/postgres/block_version_repo.go` — репозиторий для версий

### 3. Backend: API для истории и отката ✅
- ✅ `GET /api/v1/blocks/{id}/versions` — получение истории версий
- ✅ `POST /api/v1/blocks/{id}/restore` — откат на конкретную версию
- ✅ При откате создаётся новая версия (версионирование сохраняется)

**Обновлено:**
- `backend/internal/service/block_service.go` — методы `GetBlockVersions`, `RestoreBlockVersion`
- `backend/internal/handler/block_handler.go` — handlers для версий
- `backend/cmd/api/main.go` — routes для версий

### 4. Audit Log (уже была таблица) ✅
- ✅ Таблица `audit_logs` уже существовала в миграции 001
- ✅ Реализован репозиторий для audit log
- ✅ Логирование действий: create_block, update_block, restore_block_version

**Файлы:**
- `backend/internal/repository/postgres/audit_repo.go` — репозиторий

**Обновлено:**
- `backend/internal/service/block_service.go` — логирование при create, update, restore

### 5. Интеграция userID ✅
- ✅ Все методы сервисов принимают userID
- ✅ userID берётся из header `X-User-ID` (устанавливается AuthMiddleware)
- ✅ Версии и audit log связаны с пользователем

**Обновлено:**
- `backend/internal/handler/block_handler.go` — передача userID из header
- `backend/internal/service/block_service.go` — методы принимают userID

## Изменённые файлы

**Новые:**
- `backend/migrations/003_block_versions.up.sql`
- `backend/migrations/003_block_versions.down.sql`
- `backend/internal/domain/block_version.go`
- `backend/internal/repository/postgres/block_version_repo.go`
- `backend/internal/repository/postgres/audit_repo.go`

**Обновлённые:**
- `backend/internal/repository/repository.go` — интерфейсы для BlockVersionRepository и AuditRepository
- `backend/internal/service/block_service.go` — версионирование и audit logging
- `backend/internal/handler/block_handler.go` — передача userID и новые handlers
- `backend/cmd/api/main.go` — обновлён NewBlockService и добавлены routes

## Как применить миграцию

```bash
cd backend
migrate -path ./migrations -database "postgres://user:password@localhost/dbname?sslmode=disable" up
```

## Что нужно проверить локально

1. Применить миграцию `003_block_versions.up.sql`
2. Обновить блок через API:
   - ✅ При обновлении создаётся запись в `block_versions`
   - ✅ В `audit_logs` создаётся запись об изменении
3. Получить историю версий:
   - ✅ `GET /api/v1/blocks/{id}/versions` возвращает список версий
4. Откатить версию:
   - ✅ `POST /api/v1/blocks/{id}/restore` с `{"version": N}` откатывает блок
   - ✅ Создаётся новая версия при откате
   - ✅ В `audit_logs` создаётся запись об откате

## Acceptance Criteria

✅ Любое изменение можно отследить и откатить.

**Реализовано:**
- ✅ История изменений блока (block_versions)
- ✅ Возможность отката версии (RestoreBlockVersion)
- ✅ Audit log: кто что когда (audit_logs с user_id, action, entity_type, entity_id, changes)

## Следующие шаги

**ЭТАП 7: Подготовка к миграции (без деплоя)** — redirects.csv, баннер о переходе, обновление MIGRATION.md.

