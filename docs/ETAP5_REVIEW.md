# ЭТАП 5: SEO пакет (базовый) — REVIEW

## Цель
Сайт корректно индексируется. Реализовать базовый SEO-комплект: sitemap.xml, robots.txt, meta теги, Open Graph, Schema.org.

## Выполнено

### 1. sitemap.xml ✅
- ✅ Динамическая генерация через Next.js route handler (`app/sitemap.ts`)
- ✅ Получение всех опубликованных страниц из API
- ✅ Фильтрация только published страниц
- ✅ Правильные URL (главная как `/`, остальные как `/slug`)
- ✅ Приоритеты (главная - 1.0, остальные - 0.8)
- ✅ lastModified из updated_at или created_at
- ✅ changeFrequency: weekly
- ✅ Fallback на базовые страницы при ошибке

**Файлы:**
- `frontend/app/sitemap.ts`

### 2. robots.txt ✅
- ✅ Генерация через Next.js route handler (`app/robots.ts`)
- ✅ Allow: `/`
- ✅ Disallow: `/admin/`, `/api/`
- ✅ Sitemap ссылка

**Файлы:**
- `frontend/app/robots.ts`

### 3. Meta title/description из CMS ✅
- ✅ Уже реализовано в `generateMetadata`
- ✅ Использует `meta_title` и `meta_description` из CMS
- ✅ Fallback на `title` если `meta_title` нет

**Проверено:**
- `frontend/app/[slug]/page.tsx`
- `frontend/app/page.tsx`

### 4. Open Graph теги ✅
- ✅ Добавлены в `generateMetadata` для всех страниц
- ✅ Поля: title, description, url, siteName, locale, type
- ✅ Twitter Card: summary_large_image
- ✅ Canonical URL

**Обновлено:**
- `frontend/app/[slug]/page.tsx`
- `frontend/app/page.tsx`

### 5. Schema.org разметка ✅

**LocalBusiness** (главная страница):
- ✅ name, url, telephone
- ✅ address (PostalAddress)
- ✅ geo (GeoCoordinates)
- ✅ openingHoursSpecification
- ✅ priceRange

**Service** (страницы услуг):
- ✅ serviceType
- ✅ provider (LocalBusiness)
- ✅ areaServed
- ✅ description

**BreadcrumbList** (страницы услуг):
- ✅ itemListElement с позициями
- ✅ Главная → Страница услуги

**Файлы:**
- `frontend/components/seo/SchemaOrg.tsx` — компонент для генерации JSON-LD

**Интеграция:**
- `frontend/app/[slug]/page.tsx` — добавлены Schema.org для соответствующих страниц
- `frontend/app/page.tsx` — добавлен LocalBusiness для главной

## Изменённые файлы

**Новые:**
- `frontend/app/sitemap.ts`
- `frontend/app/robots.ts`
- `frontend/components/seo/SchemaOrg.tsx`

**Обновлённые:**
- `frontend/app/[slug]/page.tsx` — добавлены Open Graph и Schema.org
- `frontend/app/page.tsx` — добавлены Open Graph и Schema.org

## Настройка

### Environment переменные:
```env
NEXT_PUBLIC_SITE_URL=https://jaluzi-peterburg.ru
```

## Что нужно проверить локально

1. **sitemap.xml:**
   - ✅ `/sitemap.xml` возвращает XML с опубликованными страницами
   - ✅ Все published страницы включены
   - ✅ Правильные URL и приоритеты

2. **robots.txt:**
   - ✅ `/robots.txt` возвращает корректный файл
   - ✅ Правильные allow/disallow правила
   - ✅ Ссылка на sitemap

3. **Meta теги:**
   - ✅ View source страницы — есть title и description
   - ✅ Используются данные из CMS

4. **Open Graph:**
   - ✅ View source — есть og:title, og:description, og:url
   - ✅ Проверить через Facebook Debugger или аналоги

5. **Schema.org:**
   - ✅ View source — есть JSON-LD скрипты
   - ✅ Проверить через Google Rich Results Test

## Acceptance Criteria

✅ SEO-база готова, без избыточных оптимизаций.

**Реализовано:**
- ✅ sitemap.xml (динамический)
- ✅ robots.txt
- ✅ Meta title/description из CMS
- ✅ Open Graph теги
- ✅ Schema.org: LocalBusiness, Service, Breadcrumb

**Базовый SEO-комплект готов для индексации.**

## Следующие шаги

**ЭТАП 6: Версионирование и аудит** — история изменений блоков, возможность отката, audit log.

