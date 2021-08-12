# build stage
FROM node:16.5.0-alpine3.13 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build


# production stage
FROM nginx:1.21.1-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]