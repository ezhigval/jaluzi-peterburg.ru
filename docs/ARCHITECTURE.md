# Архитектура inline-CMS

## Концепция

Админка — это не отдельный интерфейс, а **режим редактирования поверх самого сайта**.

### Принцип работы

1. Пользователь открывает страницу: `/gorizontal`
2. Добавляет `/admin` или `?admin=true`: `/gorizontal/admin`
3. Видит ту же страницу, но:
   - Блоки подсвечиваются при hover
   - Клик по блоку → выбор и боковая панель
   - Редактирование inline или через панель
   - Автосохранение + кнопка "Опубликовать"

## Архитектура блоков

### Content Blocks

Все страницы собираются из переиспользуемых блоков:

```
Block Types:
- Hero (заголовок + изображение)
- Text (текстовый блок)
- Features (список преимуществ)
- CTA (призыв к действию)
- Gallery (галерея изображений)
- FAQ (вопросы-ответы)
- Form (форма заявки)
- Price (блок с ценой)
- Colors (палитра цветов)
- Specifications (характеристики)
```

### Структура блока

```typescript
interface ContentBlock {
  id: string;              // UUID
  type: BlockType;         // 'hero' | 'text' | 'cta' | ...
  pageId: string;          // ID страницы
  order: number;           // Порядок на странице
  data: BlockData;         // Данные блока (типизированы по типу)
  status: 'draft' | 'published';
  version: number;          // Версионирование
  createdAt: string;
  updatedAt: string;
}
```

### Рендеринг

**Обычный режим:**
```tsx
<BlockRenderer block={block} mode="view" />
```

**Режим админки:**
```tsx
<BlockRenderer block={block} mode="edit" onSelect={handleSelect} />
```

## Frontend архитектура

### Структура компонентов

```
/frontend
  /app                    # Next.js App Router
    /[slug]               # Динамические страницы услуг
      /page.tsx
      /admin
        /page.tsx         # Админ-режим
  /components
    /blocks               # Компоненты блоков
      /Hero.tsx
      /Text.tsx
      /CTA.tsx
      ...
    /cms                  # CMS компоненты
      /Editor.tsx         # Главный редактор
      /Sidebar.tsx        # Боковая панель
      /BlockOverlay.tsx   # Оверлей для блоков
      /BlockSelector.tsx  # Выбор блока
  /lib
    /cms                  # CMS логика
      /hooks.ts           # useCMS, useBlockEditor
      /store.ts           # Состояние редактора
      /api.ts             # API клиент
    /blocks               # Утилиты блоков
      /registry.ts        # Реестр типов блоков
      /schemas.ts         # Zod схемы
```

### CMS Store (Zustand)

```typescript
interface CMSStore {
  mode: 'view' | 'edit';
  selectedBlockId: string | null;
  blocks: ContentBlock[];
  isDirty: boolean;
  isSaving: boolean;
  
  setMode: (mode: 'view' | 'edit') => void;
  selectBlock: (blockId: string) => void;
  updateBlock: (blockId: string, data: Partial<BlockData>) => void;
  save: () => Promise<void>;
  publish: () => Promise<void>;
}
```

### Блоки с data-атрибутами

Каждый блок обёрнут в `<div data-block-id={id} data-block-type={type}>` для:
- Подсветки при hover
- Выбора при клике
- Drag & drop (опционально)

## Backend архитектура

### API структура

```
GET  /api/v1/pages              # Список страниц
GET  /api/v1/pages/:id          # Страница с блоками
POST /api/v1/pages              # Создать страницу
PUT  /api/v1/pages/:id          # Обновить страницу

GET  /api/v1/blocks             # Блоки страницы
POST /api/v1/blocks             # Создать блок
PUT  /api/v1/blocks/:id         # Обновить блок
DELETE /api/v1/blocks/:id       # Удалить блок

POST /api/v1/blocks/:id/publish # Опубликовать блок
GET  /api/v1/blocks/:id/history # История версий

POST /api/v1/leads              # Создать лид (форма)
GET  /api/v1/leads              # Список лидов (admin)
PUT  /api/v1/leads/:id/status   # Изменить статус лида

POST /api/v1/auth/login         # Авторизация админа
POST /api/v1/auth/refresh       # Обновить токен
```

### База данных

```sql
-- Страницы
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Блоки контента
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  order_index INTEGER NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Версионирование (опционально, для истории)
CREATE TABLE block_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Лиды
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  message TEXT,
  page_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Пользователи (админы)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Clean Architecture (Go)

```
/backend
  /cmd
    /api
      /main.go              # Точка входа
  /internal
    /domain                 # Бизнес-логика
      /page.go
      /block.go
      /lead.go
    /repository             # Слой данных
      /postgres
        /page_repo.go
        /block_repo.go
    /service                # Use cases
      /page_service.go
      /cms_service.go
      /lead_service.go
    /handler                # HTTP handlers
      /page_handler.go
      /block_handler.go
      /lead_handler.go
    /middleware
      /auth.go
      /logger.go
      /cors.go
  /pkg
    /config                 # Конфигурация
    /database               # DB connection
    /validator              # Валидация
    /logger                 # Логирование
  /migrations               # SQL миграции
  /sqlc                     # SQLC queries
```

## Безопасность

1. **JWT авторизация** для админки
2. **CSRF защита** для форм
3. **Rate limiting** на API
4. **Валидация** всех входных данных (Zod + validator)
5. **SQL injection** защита через параметризованные запросы (sqlc)
6. **XSS защита** через санитизацию контента

## Производительность

1. **SSR/SSG** для SEO
2. **Кэширование** страниц (Redis опционально)
3. **Оптимизация изображений** (Next.js Image)
4. **Lazy loading** блоков
5. **Database индексы** на частые запросы

## Версионирование контента

- Каждое изменение создаёт новую версию блока
- Draft vs Published версии
- Возможность отката к предыдущей версии

