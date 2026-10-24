# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.20.0

# Build frontend assets and the bundled server with development dependencies.
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime image with production dependencies and compiled output only.
FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --chown=node:node state-backup.json ./state-backup.json

USER node
EXPOSE 3008
CMD ["node", "dist/server.cjs"]
