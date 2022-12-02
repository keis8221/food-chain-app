# build
FROM node:16.13.1-slim AS builder
WORKDIR /server
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile
COPY . .
RUN yarn build

# server
FROM node:16.13.1-slim
WORKDIR /server
COPY --from=builder /server/package*.json ./
COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/dist ./dist

CMD ["node", "dist/main.js"]
