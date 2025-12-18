# ЭТАП 1: Inline-CMS UX — REVIEW

## Цель
Сделать редактор реально удобным для использования, не демо.

## Выполнено

### 1. Состояния редактора ✅
- ✅ `view` / `edit` режимы
- ✅ `selected` — выбранный блок
- ✅ `dirty` — есть несохранённые изменения
- ✅ `saving` — идёт сохранение
- ✅ `error` — ошибка
- ✅ `lastSaved` — время последнего сохранения

Реализовано в `frontend/lib/cms/store.ts`

### 2. Визуальная обратная связь ✅
- ✅ Hover outline (синяя пунктирная рамка)
- ✅ Selected outline (синяя сплошная рамка)
- ✅ Label с типом блока при выборе
- ✅ Esc для снятия выделения
- ✅ Клик вне блока снимает выделение
- ✅ Клики по ссылкам/кнопкам не блокируются

Реализовано в `frontend/components/cms/BlockOverlay.tsx`

### 3. Sidebar ✅
- ✅ Вкладки: Content / SEO / Settings
- ✅ Кнопки: Save, Publish, Revert
- ✅ Индикатор Draft / Published
- ✅ Время последнего сохранения
- ✅ Отображение ошибок с возможностью закрыть
- ✅ Блокировка кнопок при сохранении

Реализовано в `frontend/components/cms/Sidebar.tsx`

### 4. Публикация ✅
- ✅ Confirm modal при publish (через `window.confirm`)
- ✅ Отдельный статус draft/published
- ✅ Публикация только через API endpoint `/blocks/{id}/publish`

### 5. Блокировка навигации при dirty state ✅
- ✅ Предупреждение при попытке выйти из edit режима с несохранёнными изменениями
- ✅ `beforeunload` событие для предупреждения при закрытии страницы

Реализовано в `frontend/components/cms/Editor.tsx` и `frontend/lib/cms/store.ts`

### 6. Редактирование блоков ✅
- ✅ Hero: title, subtitle
- ✅ Text: content
- ✅ CTA: title, buttonText, buttonLink
- ✅ SEO: seoTitle, seoDescription
- ✅ Settings: статус, версия, порядок (read-only пока)

## Изменённые файлы

**Новые:**
- Нет (всё расширение существующих)

**Обновлённые:**
- `frontend/lib/cms/store.ts` — расширен состояниями, методами save/publish/revert
- `frontend/components/cms/Sidebar.tsx` — полностью переписан с вкладками и состояниями
- `frontend/components/cms/BlockOverlay.tsx` — переписан для hover/selected/labels
- `frontend/components/cms/Editor.tsx` — добавлена блокировка навигации
- `frontend/components/blocks/BlockRenderer.tsx` — упрощён (логика перенесена в BlockOverlay)
- `frontend/app/globals.css` — удалены старые стили CMS (теперь через inline стили в BlockOverlay)

## Что нужно проверить локально

1. Запустить frontend: `cd frontend && npm run dev`
2. Зайти на `/gorizontal/admin` (после логина)
3. Проверить:
   - ✅ Hover по блокам → синяя пунктирная рамка
   - ✅ Клик по блоку → выделение синей рамкой + label с типом
   - ✅ Sidebar открывается с вкладками
   - ✅ Редактирование полей → появляется индикатор "Несохранённые изменения"
   - ✅ Кнопка "Сохранить" активна при dirty state
   - ✅ Сохранение → индикатор обновляется, dirty пропадает
   - ✅ Кнопка "Опубликовать" → confirm modal
   - ✅ Esc → снятие выделения
   - ✅ Попытка выйти с несохранёнными → предупреждение
   - ✅ Ошибки отображаются в Sidebar

## Acceptance Criteria

✅ Владелец бизнеса может понять, что происходит, не боясь что-то сломать.

## Следующие шаги

Переход к **ЭТАП 2: Контентные блоки** — реализация PriceBlock, ColorsBlock, GalleryBlock, FAQBlock, FeaturesBlock.
