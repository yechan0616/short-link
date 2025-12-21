# syntax=docker/dockerfile:1.7

# ---------------------------
# 1) Builder
# ---------------------------
FROM node:20-alpine AS builder

# Enable pnpm via corepack
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Install deps using cached layers
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Copy the rest
COPY . .

# Build Next.js app
ENV NODE_ENV=production
RUN pnpm build

# ---------------------------
# 2) Runner
# ---------------------------
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app

# Copy only the production output and needed files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Run Next.js in production mode
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
