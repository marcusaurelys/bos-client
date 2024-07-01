# Development build
# Use only for development
# Unoptimized image size due to development dependencies being packaged

FROM node:18-bookworm-slim AS base

# Build phase
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install

# Cache image layers
FROM base as builder
WORKDIR /app

# Separate node_modules from other files to avoid rebuild of this layer
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD npm run dev
