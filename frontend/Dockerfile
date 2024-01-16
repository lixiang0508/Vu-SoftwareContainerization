FROM node:18.17.0 AS builder
WORKDIR /web
COPY . ./
RUN npm run build

FROM nginx:1.21.5
COPY --from=builder /web/build /usr/share/nginx/html
COPY /default.conf /etc/nginx/conf.d/default.conf