FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy code, migrations, environment, and migration script
COPY src ./src
COPY migration ./migration
COPY knexfile.ts ./
COPY .env ./
COPY run_migrations.sh ./
RUN chmod +x run_migrations.sh

# Command: run migrations then start bot, logs write to bot.log
CMD ["sh", "-c", "./run_migrations.sh && node src/index.js"]
