# CI/CD — Continuous Integration

## Обзор

Проект использует GitHub Actions для автоматической проверки качества кода. CI запускается на каждый push и pull request в ветки `main` и `develop`.

## Workflow: `.github/workflows/ci.yml`

### Триггеры

- `push` в ветки `main` и `develop`
- `pull_request` в ветки `main` и `develop`

### Jobs

#### 1. Backend Checks

**Проверки Go backend:**

1. **Checkout code** — получение кода
2. **Set up Go** — установка Go 1.22
3. **Cache Go modules** — кэширование зависимостей
4. **Download dependencies** — `go mod download`
5. **Run go mod tidy check** — проверка, что `go.mod` и `go.sum` актуальны
6. **Run go vet** — статический анализ кода
7. **Run tests** — запуск unit-тестов с race detector и coverage
8. **Build** — сборка приложения

**Окружение:**
- `JWT_SECRET=dummy_secret_for_ci_testing`
- `POSTGRES_PASSWORD=dummy`

**Классы ошибок, которые ловит:**
- ✅ Синтаксические ошибки Go
- ✅ Проблемы с зависимостями (`go.mod`/`go.sum` не синхронизированы)
- ✅ Статические ошибки (`go vet`)
- ✅ Ошибки компиляции
- ✅ Падающие тесты
- ✅ Race conditions (через `-race`)

**Что не проверяет:**
- ❌ Интеграционные тесты с БД (нужна реальная БД)
- ❌ E2E тесты
- ❌ Performance тесты

#### 2. Frontend Checks

**Проверки Next.js frontend:**

1. **Checkout code** — получение кода
2. **Set up Node.js** — установка Node.js 20 LTS с кэшированием
3. **Install dependencies** — `npm ci` (чистая установка)
4. **Run linter** — ESLint проверка
5. **Type check** — TypeScript проверка типов (`tsc --noEmit`)
6. **Build** — сборка Next.js приложения

**Окружение:**
- `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

**Классы ошибок, которые ловит:**
- ✅ Синтаксические ошибки JavaScript/TypeScript
- ✅ Ошибки типов TypeScript
- ✅ ESLint warnings/errors
- ✅ Ошибки сборки Next.js
- ✅ Отсутствующие зависимости

**Что не проверяет:**
- ❌ E2E тесты (нет Playwright/Cypress)
- ❌ Визуальные регрессии
- ❌ Browser compatibility
- ❌ Runtime ошибки (только сборка)

#### 3. Docker Build Check

**Проверка сборки Docker-образов:**

1. **Checkout code**
2. **Set up Docker Buildx** — настройка Docker для сборки
3. **Build backend Docker image** — сборка образа backend
4. **Build frontend Docker image** — сборка образа frontend

**Что проверяет:**
- ✅ Dockerfile валиден
- ✅ Docker-образ собирается без ошибок
- ✅ Используется кэш GitHub Actions для ускорения

**Что не делает:**
- ❌ Push в registry
- ❌ Запуск контейнеров
- ❌ Health checks

## Кэширование

Для ускорения CI используется кэширование:

- **Go modules**: `~/go/pkg/mod` (ключ: `go.sum` hash)
- **Node modules**: через `actions/setup-node@v4` (ключ: `package-lock.json`)
- **Docker layers**: через GitHub Actions cache

## Время выполнения

- Backend checks: ~2-3 минуты
- Frontend checks: ~3-4 минуты
- Docker build: ~2-3 минуты
- **Общее время**: ~5-7 минут (при параллельном выполнении)

## Окружение CI

### Backend

Все переменные окружения — заглушки:

```bash
JWT_SECRET=dummy_secret_for_ci_testing
POSTGRES_PASSWORD=dummy
```

Реальные секреты **никогда** не используются в CI.

### Frontend

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Branch Protection

В настройках GitHub репозитория для ветки `main` должны быть включены:

1. **Require a pull request before merging**
2. **Require status checks to pass before merging**
   - ✅ Backend Checks
   - ✅ Frontend Checks
   - ✅ Docker Build Check (опционально)
3. **Do not allow bypassing the above settings**

Это гарантирует, что код не попадёт в `main` без прохождения всех проверок.

## Локальная проверка

Перед созданием PR проверь код локально:

```bash
# Backend
cd backend
go mod tidy
go vet ./...
go test ./...
go build ./cmd/api/main.go

# Frontend
cd frontend
npm ci
npm run lint
npx tsc --noEmit
npm run build
```

## Troubleshooting

### CI падает на "go mod tidy check"

**Проблема**: `go.mod` или `go.sum` изменены

**Решение**: 
```bash
cd backend
go mod tidy
git add go.mod go.sum
git commit -m "chore: update dependencies"
```

### CI падает на тестах

**Проблема**: Тесты падают в CI, но проходят локально

**Возможные причины**:
- Race conditions (используй `go test -race`)
- Разные версии зависимостей (проверь `go.sum`)
- Отсутствие тестовой БД (для unit-тестов не нужна)

### Frontend build падает

**Проблема**: Next.js не собирается

**Проверь**:
- Все переменные окружения указаны
- TypeScript ошибки исправлены
- Все зависимости установлены (`npm ci`)

### Docker build медленный

**Решение**: Кэш уже настроен через `cache-from` и `cache-to: type=gha`. При повторных сборках будет быстрее.

## Расширение CI (будущее)

Планируется добавить:

- [ ] Интеграционные тесты с тестовой БД
- [ ] E2E тесты (Playwright/Cypress)
- [ ] Code coverage отчеты (Codecov)
- [ ] Security scanning (Snyk, Dependabot)
- [ ] Performance benchmarks
- [ ] Автоматический деплой на staging

## Ссылки

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Go Testing Best Practices](https://golang.org/doc/effective_go#testing)
- [Next.js CI/CD Guide](https://nextjs.org/docs/deployment)

