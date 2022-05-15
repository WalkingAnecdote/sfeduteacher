FROM node:13.10.1-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT npm start

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html