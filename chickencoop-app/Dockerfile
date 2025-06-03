# 1. Build stage with Node 20
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm cache clean --force


COPY . .
RUN npm run build

# 2. Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]