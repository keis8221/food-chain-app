FROM node:16.13.1-slim
WORKDIR /server

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY . .
CMD ["yarn", "run", "start"]
