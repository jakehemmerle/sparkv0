# Spark - Conversation Transcription & Analysis

A web-based application to transcribe conversations between Jake and Edmund with AI-powered Q&A capabilities.

## Features

- 🎙️ **Audio Upload**: Drag-and-drop M4A audio files
- 🗣️ **Speaker Diarization**: Automatic identification of Jake and Edmund using AssemblyAI
- 💬 **Conversation View**: Chat-style transcript display with timestamps
- 🤖 **AI Q&A**: Ask questions about conversations using GPT-4o
- 📊 **Token Tracking**: Monitor token usage for transcripts and Q&A

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **react-dropzone** for file uploads

### Backend
- **Node.js** with Express
- **TypeScript**
- **SQLite** with better-sqlite3
- **AssemblyAI** for transcription
- **OpenAI GPT-4o** for Q&A

### Package Manager
- **pnpm** (required)

## Prerequisites

- **Node.js** 18+ 
- **pnpm** 10+
- **Python 3** (for better-sqlite3 native module compilation)
- **AssemblyAI API Key**
- **OpenAI API Key**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sparkv0
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
pnpm install
```

**Backend:**
```bash
cd backend
pnpm install

# Build better-sqlite3 native module
cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npm run build-release
cd ../../../../..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env  # or create manually
```

Add your API keys to `backend/.env`:

```env
PORT=3002
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_PATH=./database.sqlite
UPLOAD_DIR=./src/uploads
```

### 4. Database Initialization

The database will automatically initialize when you start the backend server. The following tables will be created:
- `sessions` - Audio session metadata
- `transcripts` - Transcription segments with speaker info
- `questions` - Q&A history

## Development

### Start Frontend (Next.js)

```bash
cd frontend
pnpm dev
```

The frontend will be available at `http://localhost:3001` (or 3000 if available)

### Start Backend (Express)

```bash
cd backend
pnpm dev
```

The backend API will run at `http://localhost:3002`

### Development Workflow

1. **Frontend**: Make changes in `frontend/app`, `frontend/components`, etc.
2. **Backend**: Make changes in `backend/src`
3. Both servers support hot-reloading

## Project Structure

```
sparkv0/
├── frontend/                # Next.js application
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── sessions/       # Session pages
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   ├── store/             # Zustand stores
│   └── package.json
│
├── backend/                # Express API
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   │   ├── database.ts
│   │   │   ├── assemblyai.ts
│   │   │   ├── openai.ts
│   │   │   └── tokens.ts
│   │   └── uploads/       # Audio file storage
│   ├── database.sqlite    # SQLite database (auto-created)
│   └── package.json
│
├── experiments/           # Experimental code
├── PRD.md                # Product Requirements Document
└── README.md             # This file
```

## API Endpoints

### Sessions
- `POST /api/sessions` - Create session & upload audio
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/:id` - Get session details + transcript
- `PATCH /api/sessions/:id/speakers` - Swap Jake/Edmund assignment

### Q&A
- `POST /api/sessions/:id/questions` - Ask question about session
- `GET /api/sessions/:id/questions` - Get Q&A history

### Health Check
- `GET /api/health` - Server status

## Building for Production

### Frontend

```bash
cd frontend
pnpm build
pnpm start
```

### Backend

```bash
cd backend
pnpm build
pnpm start
```

## Troubleshooting

### better-sqlite3 Build Issues

If you encounter issues with better-sqlite3:

```bash
cd backend/node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npm run build-release
```

Make sure you have Python 3 installed and available in your PATH.

### Port Already in Use

If port 3001 or 3002 is already in use:

**Frontend**: Next.js will automatically use the next available port
**Backend**: Change the `PORT` in `backend/.env`

### pnpm Not Found

Install pnpm globally:

```bash
npm install -g pnpm
```

Or use corepack (recommended):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Development Roadmap

See [PRD.md](./PRD.md) for detailed feature specifications and implementation phases.

### Phase 1: Project Setup ✅
- [x] Initialize Next.js frontend
- [x] Initialize Express backend
- [x] Set up SQLite database

### Phase 2: Audio Upload UI (In Progress)
- [ ] Implement drag-and-drop component
- [ ] Create upload endpoint
- [ ] Build session list view

### Phase 3: Transcription
- [ ] Integrate AssemblyAI SDK
- [ ] Implement async transcription
- [ ] Store segments in database

### Phase 4: Conversation View
- [ ] Build chat-style transcript UI
- [ ] Add speaker swap functionality
- [ ] Display token counts

### Phase 5: Q&A Feature
- [ ] Integrate GPT-4o API
- [ ] Build Q&A interface
- [ ] Implement context management

## Contributing

This is a personal project for Jake and Edmund. See Linear for task tracking and project management.

## License

Private project - All rights reserved
