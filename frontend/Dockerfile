# build svelte app
FROM node:16.6.1-slim AS Builder
WORKDIR /svelte_app
COPY pseudo_app ./
RUN npm install && yarn build

