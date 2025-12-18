# Git Setup — выполненная настройка

## ✅ Выполнено

### Базовая инициализация
- Git инициализирован в корне проекта
- Remote настроен: `https://github.com/ezhigval/jaluzi-peterburg.ru.git`

### .gitignore
Обновлен `.gitignore` с учетом:
- Go (.out, .test, bin/, vendor/)
- Node.js/Next.js (node_modules/, .next/, out/)
- Docker (docker-compose.override.yml)
- OS (.DS_Store, Thumbs.db)
- IDE (.vscode/, .idea/)
- Environment (.env, .env.local, .env.*.local)
- Secrets (*.pem, *.key, *.crt)
- Database dumps (*.db, *.sqlite, *.dump)

### Структура репозитория
```
/
├── backend/          # Go API
├── frontend/         # Next.js приложение
├── deploy/           # Docker конфиги
├── docs/             # Документация
├── scripts/          # Утилиты
├── .gitignore
├── Makefile
├── README.md
└── CONTRIBUTING.md
```

### README.md
Обновлен с описанием проекта, технологическим стеком, инструкциями по установке и запуску.

### CONTRIBUTING.md
Создан с правилами ветвления, форматом коммитов (Conventional Commits), требованиями к PR.

### Ветки
- ✅ `main` — создана и запушена
- ✅ `develop` — создана и запушена

### Первый коммит
Выполнен коммит с правильным форматом:
```
chore: initial project setup with architecture and docs
```

## 🔒 Следующие шаги (ручная настройка на GitHub)

### 1. Защита main-ветки (обязательно!)

Зайди в настройки репозитория на GitHub:
1. Settings → Branches → Add rule для `main`
2. Включи:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (минимум 1)
   - ✅ **Do not allow bypassing the above settings**

### 2. GitHub Actions (рекомендуется)

Создай `.github/workflows/ci.yml` для автоматической проверки кода при PR.

### 3. .env.example

Убедись, что в репозитории есть `.env.example` с примерами переменных окружения (без реальных секретов).

## 📋 Формат коммитов

Всегда используй [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer description if needed
```

**Типы:**
- `feat` — новая функциональность
- `fix` — исправление бага
- `refactor` — рефакторинг
- `docs` — документация
- `chore` — конфигурация, инструменты
- `test` — тесты

**Примеры:**
```
feat(admin): add login page and auth guard
fix(auth): jwt cookie security
docs: update migration guide
chore: update dependencies
```

## 🔐 Проверка безопасности

Перед каждым push проверь:

```bash
# Нет секретов в коде
grep -r "password\|secret\|token" . --exclude-dir=node_modules --exclude-dir=.git

# .env не коммитится
git status | grep .env
```

## 🌿 Работа с ветками

```bash
# Создать feature ветку
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# После завершения работы
git push -u origin feature/my-feature
# Создать PR на GitHub

# После merge PR
git checkout develop
git pull origin develop
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

## 📊 Текущее состояние

- ✅ Репозиторий инициализирован
- ✅ Основные ветки созданы (main, develop)
- ✅ Первый коммит выполнен
- ✅ Remote настроен
- ✅ .gitignore настроен
- ✅ Документация добавлена
- ⚠️ Защита main-ветки на GitHub (нужно настроить вручную)
