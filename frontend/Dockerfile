# build svelte app
FROM node:16.6.1-slim
WORKDIR /var/opt/web
COPY pseudo_app ./
RUN npm install && yarn build
