# ЭТАП 4: Формы заявок и лиды — REVIEW

## Цель
Сайт начинает собирать заявки. Реализовать формы на фронте, Telegram/Email уведомления, админку для лидов.

## Выполнено

### 1. Frontend: Формы заявок ✅

**Короткая форма (`ShortLeadForm`)**
- ✅ Поля: имя, телефон
- ✅ React Hook Form + Zod валидация
- ✅ Honeypot поле для защиты от ботов
- ✅ UX состояния: loading, success, error
- ✅ Отправка на `/api/v1/leads`

**Расширенная форма (`ExtendedLeadForm`)**
- ✅ Поля: имя, телефон, email, тип услуги, сообщение
- ✅ React Hook Form + Zod валидация
- ✅ Honeypot поле
- ✅ Выбор типа услуги (горзонтальные, вертикальные, римские, ремонт, другое)
- ✅ UX состояния: loading, success, error

**Файлы:**
- `frontend/components/forms/ShortLeadForm.tsx`
- `frontend/components/forms/ExtendedLeadForm.tsx`
- `frontend/lib/schemas/lead-schemas.ts` — Zod schemas для валидации

### 2. Backend: Telegram уведомления ✅
- ✅ Интеграция с Telegram Bot API
- ✅ Форматирование сообщений (HTML)
- ✅ Асинхронная отправка (goroutine)
- ✅ Обработка ошибок с логированием

**Файлы:**
- `backend/internal/notification/telegram.go`
- `backend/internal/notification/utils.go`

### 3. Backend: Email fallback ✅
- ✅ SMTP отправка через стандартный `net/smtp`
- ✅ HTML шаблон для email
- ✅ Fallback при ошибке Telegram
- ✅ Настройка через env переменные

**Файлы:**
- `backend/internal/notification/email.go`

### 4. Backend: Асинхронная отправка ✅
- ✅ Уведомления отправляются асинхронно (`go s.notify(lead)`)
- ✅ Не блокирует создание лида
- ✅ Логирование ошибок

**Обновлено:**
- `backend/internal/service/lead_service.go` — реализован метод `notify`

### 5. Admin: Список лидов ✅
- ✅ Страница `/admin/leads`
- ✅ Таблица со всеми лидами
- ✅ Фильтр по статусу
- ✅ Поиск по имени/телефону/email
- ✅ Изменение статуса лида
- ✅ Цветные индикаторы статусов

**Файлы:**
- `frontend/app/admin/leads/page.tsx`

### 6. Admin: Экспорт CSV ✅
- ✅ Endpoint `/api/v1/leads/export`
- ✅ Экспорт всех лидов в CSV
- ✅ Все поля лида (ID, имя, телефон, email, сообщение, страница, статус, дата)

**Обновлено:**
- `backend/internal/handler/lead_handler.go` — добавлен `ExportLeadsCSV`
- `backend/cmd/api/main.go` — добавлен route для экспорта

## Изменённые файлы

**Новые:**
- `frontend/components/forms/ShortLeadForm.tsx`
- `frontend/components/forms/ExtendedLeadForm.tsx`
- `frontend/lib/schemas/lead-schemas.ts`
- `frontend/lib/api/leads.ts`
- `frontend/app/admin/leads/page.tsx`
- `backend/internal/notification/telegram.go`
- `backend/internal/notification/email.go`
- `backend/internal/notification/utils.go`

**Обновлённые:**
- `backend/internal/service/lead_service.go` — реализованы уведомления
- `backend/internal/handler/lead_handler.go` — добавлен экспорт CSV и фильтр
- `backend/cmd/api/main.go` — обновлён NewLeadService и добавлен route экспорта

## Настройка

### Environment переменные для backend (.env):
```env
# Telegram (основной канал уведомлений)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# SMTP (fallback)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=password
SMTP_FROM=noreply@jaluzi-peterburg.ru
```

## Что нужно проверить локально

1. **Формы:**
   - ✅ Короткая форма отправляется корректно
   - ✅ Расширенная форма отправляется корректно
   - ✅ Валидация работает
   - ✅ Honeypot защищает от ботов
   - ✅ Success/error состояния отображаются

2. **Уведомления:**
   - ✅ При создании лида отправляется Telegram (если настроен)
   - ✅ При ошибке Telegram отправляется Email (если настроен)
   - ✅ Уведомления не блокируют создание лида

3. **Админка:**
   - ✅ `/admin/leads` открывается (требует авторизации)
   - ✅ Список лидов загружается
   - ✅ Фильтр по статусу работает
   - ✅ Поиск работает
   - ✅ Изменение статуса работает
   - ✅ Экспорт CSV работает

## Acceptance Criteria

✅ Заявка → Telegram → БД → админка.

**Полный цикл:**
1. ✅ Пользователь заполняет форму на сайте
2. ✅ Лид сохраняется в БД
3. ✅ Отправляется уведомление в Telegram (если настроен)
4. ✅ При ошибке Telegram отправляется Email (если настроен)
5. ✅ Админ видит лид в `/admin/leads`
6. ✅ Админ может изменить статус лида
7. ✅ Админ может экспортировать лиды в CSV

## Следующие шаги

**ЭТАП 5: SEO пакет (базовый)** — sitemap.xml, robots.txt, meta теги, Schema.org.

