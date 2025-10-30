# alerts_api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src ./src
# Copy knexfile from root
COPY ../knexfile.ts ./

RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY ../knexfile.ts ./
COPY .env ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
