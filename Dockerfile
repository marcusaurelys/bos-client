# Production build
# The production build of all time

FROM node:18-bookworm-slim AS base

# Build phase
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY tailwind.config.ts .

# I don't know what the fuck this file is but it looks important so let's copy it
COPY components.json .

ARG MONGO_URI_PRODUCTION
ENV MONGO_URI_PRODUCTION=${MONGO_URI_PRODUCTION}

RUN npm run build

# Cache image layers
FROM base as builder
WORKDIR /app

# Separate node_modules from other files to avoid rebuild of this layer
COPY --from=deps /app .

EXPOSE 3000

CMD npm run start
