FROM node:20-alpine AS deps-prod
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile

FROM deps-prod AS build
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["yarn", "start"]