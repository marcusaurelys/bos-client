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


ARG MONGO_URI
ENV MONGO_URI=${MONGO_URI}

ARG HOST
ENV HOST=${HOST}

ARG CRISP_WEBSITE_ID
ENV CRISP_WEBSITE_ID=${CRISP_WEBSITE_ID}

ARG CRISP_API_ID
ENV CRISP_API_ID=${CRISP_API_ID}

ARG CRISP_API_KEY
ENV CRISP_API_KEY=${CRISP_API_KEY}

ARG CHATBOT_URL
ENV CHATBOT_URL=${CHATBOT_URL}

ARG CHATBOT_API_KEY
ENV CHATBOT_API_KEY=${CHATBOT_API_KEY}

RUN npm run build


# Cache image layers
FROM base as builder
WORKDIR /app

# Separate node_modules from other files to avoid rebuild of this layer
COPY --from=deps /app .

EXPOSE 3000

CMD npm run start
