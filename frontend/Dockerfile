# build svelte app
FROM node:16.6.1-slim AS Builder
WORKDIR /svelte_app
COPY pseudo_app ./
RUN yarn install && yarn build

# nginx(product)
FROM nginx:stable
WORKDIR /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=Builder /svelte_app/dist ./
