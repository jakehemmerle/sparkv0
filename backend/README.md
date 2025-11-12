# Spark Backend

Node.js/Express API for Spark conversation transcription app.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run database migrations
npx prisma db push

# Start development server
pnpm dev
```

Server runs at: http://localhost:3002

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Run production build
- `pnpm reset` - Reset database and clear uploaded files

## Database Reset

To clear all sessions and uploaded files:

```bash
pnpm reset
```

Or run the script directly:

```bash
./reset-db.sh
```

This will:
- Stop the backend server (if running)
- Delete the SQLite database
- Clear all uploaded audio files
- Recreate the database schema

## Environment Variables

Create a `.env` file:

```env
PORT=3002
ASSEMBLYAI_API_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here
DATABASE_URL="file:database.sqlite"
UPLOAD_DIR=./src/uploads
```

## API Endpoints

### Sessions
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Upload M4A audio file
- `GET /api/sessions/:id` - Get session details with transcript
- `PATCH /api/sessions/:id/speakers` - Swap Jake/Edmund assignment

### Questions (Q&A)
- `POST /api/sessions/:id/questions` - Ask question about session
- `GET /api/sessions/:id/questions` - Get Q&A history

### Health
- `GET /api/health` - Server status check

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── routes/
│   │   └── sessions.ts       # Session API routes
│   ├── services/
│   │   └── database.ts       # Prisma client
│   └── uploads/              # Uploaded audio files
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── database.sqlite       # SQLite database
├── reset-db.sh               # Database reset script
└── package.json
```

## Tech Stack

- **Node.js** + **Express** - Web server
- **TypeScript** - Type safety
- **Prisma** - ORM for SQLite
- **Multer** - File upload handling
- **SQLite** - Database
