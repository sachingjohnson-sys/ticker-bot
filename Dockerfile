# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code, migrations, and configs
COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY knexfile.ts ./
COPY migrate.ts ./
COPY .env ./
COPY run_migrations.sh ./
RUN chmod +x run_migrations.sh

# Build TypeScript -> JavaScript
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine
WORKDIR /app

# Copy only needed runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/migrate.ts ./migrate.ts
COPY --from=builder /app/run_migrations.sh ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Install only production dependencies and ts-node locally
RUN npm ci --omit=dev && npm install --save-dev ts-node typescript

RUN chmod +x run_migrations.sh

# Run DB migrations, then start the bot worker
CMD ["sh", "-c", "./run_migrations.sh && node dist/index.js"]
