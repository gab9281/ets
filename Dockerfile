# Frontend build stage
FROM node:18 AS frontend_build
WORKDIR /usr/src/app/client
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build

# Backend build stage
FROM node:18 AS backend_build
WORKDIR /usr/src/app/serveur
COPY ./serveur/package*.json ./
RUN npm install
COPY ./serveur .

# Nginx build stage
FROM nginx AS nginx_build
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Final stage
FROM node:18
WORKDIR /app
COPY --from=frontend_build /usr/src/app/client/build ./client
COPY --from=backend_build /usr/src/app/serveur ./
COPY --from=nginx_build /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
