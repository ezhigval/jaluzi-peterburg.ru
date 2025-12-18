#!/bin/bash
# Скрипт для создания первого администратора

set -e

echo "Создание администратора для CMS"
echo ""

# Запрашиваем данные
read -p "Email: " EMAIL
read -sp "Password: " PASSWORD
echo ""

# Генерируем bcrypt hash (требует Node.js или Go)
if command -v node &> /dev/null; then
    # Используем Node.js для генерации bcrypt hash
    HASH=$(node -e "const bcrypt = require('bcrypt'); bcrypt.hash(process.argv[1], 10).then(h => console.log(h));" "$PASSWORD" 2>/dev/null || echo "")
    if [ -z "$HASH" ]; then
        echo "Ошибка: требуется установить bcrypt для Node.js или использовать Go"
        exit 1
    fi
else
    echo "Требуется Node.js для генерации bcrypt hash"
    echo "Или создайте пользователя вручную в БД:"
    echo ""
    echo "INSERT INTO users (id, email, password_hash, role) VALUES ("
    echo "  gen_random_uuid(),"
    echo "  '$EMAIL',"
    echo "  '\$2a\$10\$...', -- bcrypt hash пароля"
    echo "  'admin'"
    echo ");"
    exit 1
fi

# Параметры БД из .env или дефолтные
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_USER=${POSTGRES_USER:-jaluzi}
DB_PASS=${POSTGRES_PASSWORD:-jaluzi_dev_password}
DB_NAME=${POSTGRES_DB:-jaluzi_db}

# SQL запрос
SQL="INSERT INTO users (id, email, password_hash, role) VALUES (gen_random_uuid(), '$EMAIL', '$HASH', 'admin') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;"

# Выполняем через psql
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "$SQL"

echo ""
echo "✅ Администратор создан/обновлён: $EMAIL"

