# Git Setup — выполненная настройка

## Что сделано

### ✅ Базовая инициализация
- Git инициализирован в корне проекта
- Remote настроен: `https://github.com/ezhigval/jaluzi-peterburg.ru.git`

### ✅ .gitignore
Обновлен `.gitignore` с учетом:
- Go (.out, .test, bin/, vendor/)
- Node.js/Next.js (node_modules/, .next/, out/)
- Docker (docker-compose.override.yml)
- OS (.DS_Store, Thumbs.db)
- IDE (.vscode/, .idea/)
- Environment (.env, .env.local, .env.*.local)
- Secrets (*.pem, *.key, *.crt)
- Database dumps (*.db, *.sqlite, *.dump)

### ✅ .env.example
Файл `.env.example` создан и содержит все необходимые переменные окружения с примерными значениями.

### ✅ Структура репозитория
```
/
├── backend/          # Go API
├── frontend/         # Next.js приложение
├── deploy/           # Docker конфиги
├── docs/             # Документация
├── scripts/          # Утилиты
├── .gitignore
├── .env.example
├── Makefile
├── README.md
└── CONTRIBUTING.md
```

### ✅ README.md
Обновлен с:
- Описанием проекта
- Технологическим стеком
- Инструкциями по установке и запуску
- Структурой проекта
- Ссылками на документацию

### ✅ CONTRIBUTING.md
Создан с правилами:
- Ветвления (main, develop, feature/, fix/)
- Формат коммитов (Conventional Commits)
- Запрет прямых коммитов в main
- Требования к PR
- Code Review процесс

### ✅ Первый коммит
Выполнен коммит с правильным форматом:
```
chore: initial project setup with architecture and docs
```

### ✅ Ветки
- `main` — создана и запушена
- `develop` — создана и запушена

## Следующие шаги (ручная настройка на GitHub)

### 1. Защита main-ветки

Зайди в настройки репозитория на GitHub:
1. Settings → Branches
2. Add rule для `main`
3. Включи:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (минимум 1, можно сам себе)
   - ✅ Require status checks to pass before merging
   - ✅ Do not allow bypassing the above settings

### 2. GitHub Actions (опционально)

Создай `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.22'
      - run: cd backend && go mod download
      - run: cd backend && go vet ./...
      - run: cd backend && go test ./...

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build
```

## Проверка безопасности

Перед каждым push проверь:

```bash
# Нет секретов в коде
grep -r "password\|secret\|token" . --exclude-dir=node_modules --exclude-dir=.git

# .env не коммитится
git status | grep .env
```

## Формат коммитов

Всегда используй Conventional Commits:

```
type(scope): short description

Longer description if needed
```

Примеры:
- `feat(admin): add login page`
- `fix(auth): jwt cookie security`
- `docs: update migration guide`
- `chore: update dependencies`

## Работа с ветками

```bash
# Создать feature ветку
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# После завершения работы
git push -u origin feature/my-feature
# Создать PR на GitHub

# После merge PR, удалить ветку
git checkout develop
git pull origin develop
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

