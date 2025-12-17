# Руководство по участию в разработке

## Ветки

### Основные ветки

- `main` — стабильная ветка, готовая к деплою
- `develop` — основная рабочая ветка для разработки

### Ветки для работы

- `feature/<short-name>` — новая функциональность
  - Пример: `feature/admin-login`, `feature/inline-editor-ux`
- `fix/<short-name>` — исправление багов
  - Пример: `fix/jwt-cookie`, `fix/cms-block-render`
- `docs/<short-name>` — изменения в документации
- `refactor/<short-name>` — рефакторинг без изменения функциональности

## Правила работы с ветками

1. **Никогда не коммить напрямую в `main`**
2. Все изменения через Pull Request
3. Создавай ветку от `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

## Формат коммитов

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer description if needed
```

### Типы

- `feat` — новая функциональность
- `fix` — исправление бага
- `refactor` — рефакторинг без изменения логики
- `docs` — изменения в документации
- `chore` — конфигурация, сборка, инструменты
- `test` — добавление или изменение тестов
- `style` — форматирование кода (не влияет на логику)
- `perf` — улучшение производительности

### Scope (опционально)

Указывай область изменений:
- `admin` — админка
- `cms` — CMS система
- `auth` — авторизация
- `api` — API endpoints
- `frontend` — фронтенд
- `backend` — бэкенд
- `db` — база данных
- `deploy` — деплой

### Примеры

```
feat(admin): add proper login page and auth guard
feat(cms): implement PriceBlock and ColorsBlock
fix(auth): move jwt storage to httpOnly cookies
docs: update migration and admin docs
chore: setup docker-compose and makefile
refactor(cms): extract block renderer to separate component
test(api): add tests for auth endpoints
```

### Запрещено

❌ `fix`
❌ `update`
❌ `wip`
❌ `123`
❌ `asdf`

## Перед коммитом

### Проверка кода

**Важно**: Запускай проверки локально перед коммитом. CI будет проверять то же самое, но лучше не тратить время на очевидные ошибки.

```bash
# Backend
cd backend
go fmt ./...
go vet ./...
go test ./...
go build ./cmd/api/main.go

# Frontend
cd frontend
npm run lint
npx tsc --noEmit  # type check
npm run build  # проверка сборки
```

### CI проверки

После создания PR автоматически запустится CI, который проверит:
- ✅ `go mod tidy` (не должно быть изменений)
- ✅ `go vet ./...`
- ✅ `go test ./...`
- ✅ Сборку backend
- ✅ Линтинг frontend
- ✅ TypeScript проверку
- ✅ Сборку frontend
- ✅ Docker build

**PR не будет принят без зелёного CI.** Все проверки должны пройти успешно.

### Проверка безопасности

```bash
# Проверь, что нет секретов
grep -r "password\|secret\|token" . --exclude-dir=node_modules --exclude-dir=.git
# Убедись, что .env не коммитится
git status | grep .env
```

## Pull Request

### Создание PR

1. Создай ветку от `develop`
2. Внеси изменения
3. Сделай коммиты с правильными сообщениями
4. Запушь ветку
5. Создай PR в GitHub

### Описание PR

Обязательно укажи:
- Что изменено
- Почему это нужно
- Как проверить

Пример:
```markdown
## Что сделано
- Добавлена страница логина `/admin/login`
- Реализован AuthGuard для защиты админ-страниц
- JWT перенесен в httpOnly cookie

## Как проверить
1. Запустить backend и frontend
2. Открыть `/gorizontal/admin`
3. Должен быть редирект на `/admin/login`
4. Войти с правильными credentials
```

### После создания PR

- Убедись, что CI проходит
- Дождись review (если требуется)
- Исправь замечания
- После merge удали ветку локально и на GitHub

## Code Review

- Будь вежлив и конструктивен
- Объясняй свои комментарии
- Предлагай решения, а не только указывай на проблемы
- Отвечай на комментарии и закрывай дискуссии

## Тестирование

### Минимальные требования

- Код компилируется
- Линтеры проходят
- Основной функционал работает

### Идеально

- Unit тесты для критичной логики
- Integration тесты для API
- E2E тесты для ключевых сценариев (опционально)

## Вопросы?

Создай Issue в GitHub или спроси в обсуждениях.

