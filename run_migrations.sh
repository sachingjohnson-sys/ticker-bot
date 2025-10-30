#!/bin/sh
export $(grep -v '^#' .env | xargs)

MAX_RETRIES=10
DELAY=2
ATTEMPT=1

echo "Running migrations with retry..."

while [ $ATTEMPT -le $MAX_RETRIES ]; do
  echo "Migration attempt $ATTEMPT..."
  
  if npm run migrate:latest; then
    echo "Migrations completed successfully."
    exit 0
  else
    echo "Migration failed, retrying in $DELAY seconds..."
    sleep $DELAY
    ATTEMPT=$((ATTEMPT + 1))
  fi
done

echo "Failed to run migrations after $MAX_RETRIES attempts."
exit 1
