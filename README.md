# Spark - Conversation Transcription & Analysis

A web-based application to transcribe conversations between Jake and Edmund with AI-powered Q&A capabilities.

## Features

### ✅ Implemented
- 🎙️ **Audio Upload**: Drag-and-drop M4A audio files with progress tracking
- 🗣️ **Speaker Diarization**: Automatic speaker identification using AssemblyAI
- 📊 **Token Tracking**: Real-time token counting for transcripts
- 🔄 **Real-time Status Polling**: Auto-updates during transcription processing
- 📋 **Session Management**: View and manage all transcription sessions

### 🚧 Planned
- 💬 **Conversation View**: Chat-style transcript display with timestamps (Phase 4)
- 🔄 **Speaker Swap**: Swap Jake/Edmund assignment if diarization is incorrect (Phase 4)
- 🤖 **AI Q&A**: Ask questions about conversations using GPT-4o (Phase 5)

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **react-dropzone** for file uploads

### Backend
- **Node.js** with Express
- **TypeScript**
- **SQLite** with Prisma ORM
- **AssemblyAI SDK (v4.19)** for transcription with speaker diarization
- **tiktoken** for GPT-4o token counting
- **Multer** for file uploads

### Package Manager
- **pnpm 10+** (required)

## Prerequisites

- **Node.js** 18+ 
- **pnpm** 10+
- **AssemblyAI API Key** ([Get one here](https://www.assemblyai.com/))
- **OpenAI API Key** (for Phase 5 Q&A feature)

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

# Generate Prisma Client
pnpm prisma generate
```

### 3. Environment Configuration

Create a `.env` file in the **root directory**:

```bash
# Copy from .env.example if available, or create manually
touch .env
```

Add your API keys to `.env`:

```env
# Backend API
PORT=3002

# Database
DATABASE_URL="file:./prisma/database.sqlite"

# AI Services
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # For Phase 5
```

### 4. Database Setup

Initialize the Prisma database:

```bash
cd backend
pnpm prisma db push
```

This creates the SQLite database with the following tables:
- `sessions` - Audio session metadata (status, duration, token count)
- `transcripts` - Transcription segments with speaker info
- `questions` - Q&A history (Phase 5)

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
- `POST /api/sessions` - Upload M4A audio and create session
- `GET /api/sessions` - List all sessions (ordered by date)
- `GET /api/sessions/:id` - Get session details with transcript
- `GET /api/sessions/:id/status` - Get real-time transcription status (polls AssemblyAI)
- `PATCH /api/sessions/:id/speakers` - Swap Jake/Edmund assignment (Phase 4)

### Q&A (Phase 5)
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

### Prisma Client Not Generated

If you see Prisma import errors:

```bash
cd backend
pnpm prisma generate
```

### Database Schema Changes

After modifying `backend/prisma/schema.prisma`:

```bash
cd backend
pnpm prisma db push
pnpm prisma generate
```

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

### Phase 1: Project Setup ✅ Complete
- [x] Initialize Next.js 16 frontend with TypeScript
- [x] Initialize Express backend with TypeScript
- [x] Set up SQLite with Prisma ORM
- [x] Configure project structure

### Phase 2: Audio Upload UI ✅ Complete
- [x] Implement drag-and-drop component with react-dropzone
- [x] Add M4A file validation
- [x] Create upload endpoint with progress tracking
- [x] Build session list view with Zustand store

### Phase 3: Backend & AssemblyAI Integration ✅ Complete
- [x] Integrate AssemblyAI SDK with speaker diarization
- [x] Implement async transcription workflow
- [x] Add real-time status polling
- [x] Parse and store utterances in database
- [x] Implement token counting with tiktoken
- [x] Handle transcription errors with retry logic

### Phase 4: Conversation View 🚧 Next
- [ ] Build chat-style transcript UI
- [ ] Add timestamp display for each segment
- [ ] Implement speaker swap functionality
- [ ] Display total token count
- [ ] Add navigation from session list

### Phase 5: Q&A Feature 🚧 Planned
- [ ] Integrate OpenAI GPT-4o API
- [ ] Build Q&A chat interface
- [ ] Implement context management
- [ ] Display answers with timestamp references
- [ ] Track Q&A token usage

## Contributing

This is a personal project for Jake and Edmund. See Linear for task tracking and project management.

## License

Private project - All rights reserved
