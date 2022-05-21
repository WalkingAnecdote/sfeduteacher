FROM node:13.10.1-alpine as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html