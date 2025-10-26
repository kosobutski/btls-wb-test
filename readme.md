# Приложение для связки API WB, базы данных postgres и Google Spreadsheets

## Описание
Приложение ежечасно (каждые 0 минут каждого часа) получает актуальную информацию о тарифах WB и сохраняет их в БД. Также ежечасно (каждые 5 минут каждого часа) обновляются привязанные к приложению google-таблицы. Используемый язык - TypeScript, вместо npm используется yarn.

В шаблоне настоены контейнеры для `postgres` и приложения на `nodejs`.  
Для взаимодействия с БД используется `knex.js`.  
В контейнере `app` используется `build` для приложения на `ts`.\
Для выполнения операций согласно расисанию используется фреймворк `node-schedule`

Все настройки можно найти в файлах:
- compose.yaml
- Dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

Для работы с гугл таблицами нужно заполнить соответствующие им переменные окружения в `.env`, для этого потребуется иметь сервисный аккаунт Google. Инструкция по созданию [здесь](https://chinnov.ru/help/tpost/zi828zfa21-kak-sozdat-servisnii-akkaunt-google-clou).

## Команды:

### Запуск приложения и базы данных:
```bash
docker-compose up
```
Если после первого запуска был изменен код, то следует запустить с пересборкой:
```bash
docker-compose up -d --build
```

### Запуск отдельно базы данных:
```bash
docker-compose up -d --build postgres
```

### Запуск отдельно приложения:
```bash
docker-compose up -d --build app
```

### Для выполнения миграций не из контейнера:
```bash
yarn knex:dev migrate latest
```
Еесли не работает предыдущая команда:
```bash
npx tsx src/utils/knex.ts migrate latest
```

### Для выполнения сидов не из контейнера:
```bash
yarn knex:dev seed run
```
Если не работает предыдущая команда:
```bash
npx tsx src/utils/knex.ts seed run
```

### Для просмотра логов приложения:
```bash
docker logs app
```

### Для просмотра списка созданных таблиц (быстрая проверка корректности выполнения миграций):
```bash
docker exec postgres psql -U postgres -d <имя_вашей_базы_данных> -c "\dt"
```

### Для установки зависимостей:
```bash
yarn install
```

### Для сборки приложения:
```bash
yarn build
```

### Для запуска приложения:
```bash
yarn start
```
