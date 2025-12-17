# Frontend

Next.js приложение с inline-CMS.

## Структура

```
/app              Next.js App Router
  /[slug]         Динамические страницы
  /[slug]/admin   Админ-режим
/components
  /blocks         Компоненты блоков контента
  /cms            CMS компоненты (редактор, сайдбар)
/lib
  /cms            CMS логика (store, API)
```

## Запуск

```bash
# Установить зависимости
npm install

# Dev режим
npm run dev

# Production build
npm run build
npm start
```

## Inline-CMS

Админка работает поверх страниц:
- `/gorizontal` - обычная страница
- `/gorizontal/admin` - режим редактирования

### Как это работает

1. Страница рендерится с блоками контента
2. В режиме админки блоки получают `data-block-id`
3. Клик по блоку → выбор → боковая панель для редактирования
4. Изменения сохраняются через API

## Компоненты блоков

- `Hero` - заголовок с фоном
- `Text` - текстовый блок
- `CTA` - призыв к действию
- И другие...

## CMS Store (Zustand)

```typescript
const { mode, selectedBlockId, blocks, updateBlock, save, publish } = useCMSStore()
```

## Тестирование

```bash
npm test
```

## Линтинг

```bash
npm run lint
```

