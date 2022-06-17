# sfeduteacher

 
### Инструкция по запуску

1. Скопировать пример файла `.env.example` в `.env`:

```bash
cp ./backend/.env.example ./backend/.env
```

2. Запустить создание контейнеров:

```bash
docker-compose up -d
```

3. Установить зависимости `php`:

```bash
docker exec app-backend sh -c 'composer install'
```

4. Запустить миграции базы данных:

```bash
docker exec app-backend sh -c 'php artisan migrate --force'
```

5. Сгенерировать ключи:

```bash
docker exec app-backend sh -c 'php artisan passport:install'
```

6. Скопировать значения, выведенные в терминал после выполнения п.5 в файл `.env`:

```
- GRANT_PASSWORD_CLIENT_ID в поле PASSPORT_GRANT_PASSWORD_CLIENT_ID
- GRANT_PASSWORD_CLIENT_SECRET в поле PASSPORT_GRANT_PASSWORD_CLIENT_SECRET
```

7. Перезапустить `docker` контейнеры:

```bash
docker-compose down
docker-compose up -d
```

8. Создать записи в БД:

```bash
docker exec app-backend sh -c 'php artisan db:seed --force'
```

После выполнения вышеописанных шагов можно получить доступ к `frontend` части приложения открыв в браузере один из следующих путей:

* http://localhost/
* http://127.0.0.1/

### Обновление контейнеров

При изменении кодовой базы нужно остановить запущеннные контейнеры:

```bash
docker-compose down
```

И поднять из снова с ключем `--build`

```bash
docker-compose up -d --build
```

Если таблицы в БД были изменены запустить миграции:

```bash
docker exec app-backend sh -c 'php artisan migrate'
```

### Возможные ошибки

#### Ошибка с неправильными ключами Laravel:

```bash
docker exec app-backend sh -c 'php artisan key:generate'
docker exec app-backend sh -c 'php artisan config:cache'
docker exec app-backend sh -c 'php artisan optimize:clear'
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
