# Product Requirements Document: Personal Conversation Transcription & Analysis App

## 1. Product Overview

**Product Name:** Spark

**Purpose:** A web-based application to transcribe conversations between Jake and Edmund with AI-powered Q&A capabilities.

**Target Users:** Jake and Edmund for analyzing their recorded conversations

---

## 2. Core Features

### 2.1 Audio Upload
- Drag-and-drop interface for M4A audio files
- Support for **M4A format only** (MVP)
- Visual feedback during upload (progress bar, status indicators)
- Session list view with metadata (date, duration, status, token count)

### 2.2 Transcription with Diarization (2 Speakers: Jake & Edmund)
- Automatic speech-to-text using **AssemblyAI**
- Speaker diarization to identify Speaker A and Speaker B
- Map speakers to **Jake** and **Edmund** (always these two names)
- Async processing with status updates
- Timestamp markers for each speech segment
- Option to swap speaker assignment if diarization assigns them incorrectly

### 2.3 Conversation View
- Back-and-forth conversation display (chat-style UI)
- Each message shows: speaker name (Jake or Edmund), timestamp, and text
- Scrollable transcript with clear visual separation between speakers
- **Token count display** for the entire conversation (total tokens used in transcript)
- Ability to click timestamp to reference specific moment

### 2.4 Conversation Q&A
- Chat interface to ask questions about the transcribed conversation
- AI-powered answers using **GPT-4o** with full transcript context
- Answers reference specific transcript segments with timestamps
- Question examples:
  - "What were the main topics discussed?"
  - "Summarize what Edmund said about work"
  - "When did Jake mention traveling?"
- Display token count for each Q&A exchange

---

## 3. Technical Architecture

### 3.1 Project Structure
```
sparkv0/
├── frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/        # Zustand stores
│   └── package.json
├── backend/           # Node.js/Express API
│   ├── src/
│   ├── database.sqlite
│   └── package.json
├── experiments/       # Existing experiments folder
├── PRD.md            # This document
├── README.md
└── .gitignore
```

### 3.2 Frontend
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS
- **File Upload:** react-dropzone (M4A only)
- **State Management:** Zustand for global state
- **API Client:** fetch or axios

### 3.3 Backend
- **Framework:** Node.js with Express + TypeScript
- **Database:** SQLite with better-sqlite3 or Prisma
- **Storage:** Local filesystem for uploaded M4A files
- **Job Processing:** Simple polling or in-memory queue (no Redis needed for MVP)
- **API:** RESTful endpoints

### 3.4 AI Services
- **Transcription:** AssemblyAI SDK with speaker diarization
- **Q&A:** OpenAI GPT-4o API with conversation context
- **Token Counting:** tiktoken library for accurate GPT-4o token counts

---

## 4. Data Models (SQLite)

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration INTEGER,
  status TEXT CHECK(status IN ('uploading', 'processing', 'ready', 'failed')),
  assembly_id TEXT,
  token_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transcripts Table
```sql
CREATE TABLE transcripts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  segments TEXT NOT NULL,
  speaker_a_is_jake BOOLEAN DEFAULT 1,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  token_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

---

## 5. Tech Stack

**Package Manager:**
- **pnpm** (always use pnpm instead of npm for all installations and scripts)

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- react-dropzone
- Zustand

**Backend:**
- Node.js + Express + TypeScript
- SQLite with better-sqlite3
- tiktoken for token counting
- Local file storage

**AI:**
- AssemblyAI SDK for transcription
- OpenAI GPT-4o for Q&A

**Deployment:**
- Netlify for frontend and serverless functions

---

## 6. Development Workflow & Tooling

### 6.1 Package Management
- **Always use pnpm** for all package installations and script execution
- Commands: `pnpm install`, `pnpm add <package>`, `pnpm dev`, `pnpm build`
- Never use npm or yarn commands

### 6.2 Linear MCP for Project Management
- Create Linear Project for Spark development
- Create Issues for each feature with proper labels and priorities
- Track progress throughout development
- Update issue status as work progresses (Todo → In Progress → Done)

### 6.3 Context7 Integration
- Use Context7 to fetch latest documentation before implementing features
- Review up-to-date examples and patterns
- Ensure type definitions are accurate

### 6.4 Chrome DevTools Verification
- Test each feature after implementation
- Verify UI elements, interactions, and network requests
- Document working state with screenshots

---

## 7. Implementation Phases

### Phase 1: Project Setup (Week 1)
- SPK-1: Initialize Next.js frontend with TypeScript + Tailwind
- SPK-2: Initialize Express backend with TypeScript
- SPK-3: Set up SQLite database with schema
- SPK-4: Create project folder structure
- SPK-5: Write PRD.md and README.md

### Phase 2: Audio Upload UI (Week 1)
- SPK-6: Install and configure react-dropzone
- SPK-7: Build AudioUpload component with M4A validation
- SPK-8: Implement upload progress indicator
- SPK-9: Create backend upload endpoint
- SPK-10: Create SessionList component with Zustand store

### Phase 3: Backend & AssemblyAI Integration (Week 2)
- SPK-11: Install AssemblyAI SDK and configure API key
- SPK-12: Create transcription service with speaker diarization
- SPK-13: Implement polling mechanism for transcription status
- SPK-14: Parse utterances and store in database
- SPK-15: Add token counting with tiktoken
- SPK-16: Create API endpoints for session status

### Phase 4: Conversation View (Week 2-3)
- SPK-17: Create ConversationView component with chat layout
- SPK-18: Implement Jake/Edmund speaker styling
- SPK-19: Add timestamp display for each message
- SPK-20: Implement "Swap Speakers" button functionality
- SPK-21: Display total token count in header
- SPK-22: Add navigation from session list to conversation view

### Phase 5: Q&A Feature (Week 3)
- SPK-23: Build QAPanel component with chat interface
- SPK-24: Integrate OpenAI GPT-4o API
- SPK-25: Implement context building (full transcript to GPT-4o)
- SPK-26: Parse and display answers with timestamp references
- SPK-27: Show token usage per Q&A exchange
- SPK-28: Store Q&A history in database
- SPK-29: Display Q&A history on page load

### Phase 6: Polish & Bug Fixes (Week 3-4)
- SPK-30: Add loading states for all async operations
- SPK-31: Implement error handling and user-friendly error messages
- SPK-32: Add responsive design for mobile devices
- SPK-33: Optimize database queries and API responses
- SPK-34: Add confirmation dialogs for destructive actions
- SPK-35: Write end-to-end tests for critical flows

### Phase 7: Deployment (Week 4)
- SPK-36: Configure Netlify deployment settings
- SPK-37: Set up environment variables in Netlify
- SPK-38: Deploy frontend to Netlify
- SPK-39: Configure Netlify Functions for backend API
- SPK-40: Test production build end-to-end

---

## 8. File Structure

```
sparkv0/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Home/upload page
│   │   ├── sessions/
│   │   │   ├── page.tsx             # Session list
│   │   │   └── [id]/page.tsx        # Conversation view + Q&A
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AudioUpload.tsx
│   │   ├── ConversationView.tsx
│   │   ├── QAPanel.tsx
│   │   └── SessionList.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── store/
│   │   └── sessionStore.ts
│   ├── package.json
│   └── netlify.toml
│
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   └── sessions.ts
│   │   ├── services/
│   │   │   ├── assemblyai.ts
│   │   │   ├── openai.ts
│   │   │   ├── tokens.ts
│   │   │   └── database.ts
│   │   └── uploads/
│   ├── database.sqlite
│   ├── package.json
│   └── .env
│
├── experiments/
│   └── assembly.js
│
├── PRD.md
└── README.md
```

---

## 9. Success Criteria

### Each Feature Must Pass:
- ✅ Linear issue created and tracked
- ✅ Latest library docs fetched via Context7
- ✅ Implementation follows best practices
- ✅ No console errors in Chrome DevTools
- ✅ Network requests return expected responses
- ✅ UI verified with snapshots and screenshots
- ✅ Linear issue updated to "Done" with comments

### Project Completion Criteria:
- ✅ All 40 Linear issues marked as "Done"
- ✅ Production deployment successful
- ✅ End-to-end testing complete
- ✅ Documentation up to date (PRD + README)
