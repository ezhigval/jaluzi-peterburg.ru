#!/bin/bash

# Скрипт для инициализации БД и создания первого админа

set -e

echo "Инициализация базы данных..."

# Применение миграций
cd backend
migrate -path migrations -database "postgresql://${POSTGRES_USER:-jaluzi}:${POSTGRES_PASSWORD:-jaluzi_dev_password}@${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-jaluzi_db}?sslmode=${POSTGRES_SSLMODE:-disable}" up

echo "✅ Миграции применены"

# Создание первого админа (если нужно)
# TODO: добавить скрипт создания админа

echo "✅ Инициализация завершена"

