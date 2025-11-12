#!/bin/bash

# Reset Database Script for Spark Backend
# This script clears all sessions and uploaded files

echo "🔄 Resetting Spark database..."

# Stop backend server if running
echo "Stopping backend server..."
pkill -f "ts-node src/index.ts" 2>/dev/null && sleep 1

# Remove database files
echo "Removing database..."
rm -f prisma/database.sqlite prisma/database.sqlite-journal

# Remove uploaded files
echo "Removing uploaded files..."
rm -f src/uploads/*.m4a src/uploads/*.mp4 src/uploads/*.wav

# Recreate database schema
echo "Recreating database schema..."
npx prisma db push --skip-generate

echo "✅ Database reset complete!"
echo ""
echo "To restart the backend, run:"
echo "  pnpm dev"
