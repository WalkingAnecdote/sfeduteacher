

## Docker deploy

- `cd backend`
- copy .env.example to .env `cp .env.example .env`
- run docker compose `docker-compose up -d`
- install composer `docker exec app-backend sh -c 'composer install'`
- make migration `docker exec app-backend sh -c 'php artisan migrate --force'`
- gen auth keys `docker exec app-backend sh -c 'php artisan passport:install'`
- get and set GRANT_PASSWORD_CLIENT_ID to PASSPORT_GRANT_PASSWORD_CLIENT_ID in .env
- get and set GRANT_PASSWORD_CLIENT_SECRET to PASSPORT_GRANT_PASSWORD_CLIENT_SECRET in .env
- set APP_DEVELOPER_MODE=false if you not backend developer
- restart docker
- run seed `docker exec app-backend sh -c 'php artisan db:seed --force'`


- get access to api http://0.0.0.0:885/

## Api documentation 


## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
