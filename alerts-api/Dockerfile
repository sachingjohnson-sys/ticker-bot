# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder
WORKDIR /app


# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and config files
COPY tsconfig*.json ./
COPY src ./src
COPY .env ./



# Build the app (NestJS compiles to dist/)
RUN npm run build


# Stage 2: Run the built app in production
FROM node:20-alpine
WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

# Expose the NestJS port
EXPOSE 3000

# Command to start app
CMD ["node", "dist/main.js"]
