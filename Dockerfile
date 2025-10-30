# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and configs
COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY knexfile.ts ./
COPY migrate.ts ./
COPY .env ./
COPY bot.config.json ./
COPY run_migrations.sh ./
RUN chmod +x run_migrations.sh

# Build TypeScript -> JavaScript
RUN npx tsc

# ---- Production stage ----
FROM node:20-alpine
WORKDIR /app

# Copy necessary runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/run_migrations.sh ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/bot.config.json ./

RUN npm install --omit=dev
RUN chmod +x run_migrations.sh

# Run migrations and start app
CMD ["sh", "-c", "./run_migrations.sh && node dist/src/index.js"]
