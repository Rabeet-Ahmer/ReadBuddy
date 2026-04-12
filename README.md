<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:663820,100:212a3b&height=220&section=header&text=Read%20Buddy&fontSize=60&fontColor=ffffff&fontAlignY=35&desc=Transform%20your%20books%20into%20interactive%20AI%20conversations&descSize=18&descAlignY=55&animation=fadeIn" width="100%" />

<br/>

<a href="#"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=663820&center=true&vCenter=true&random=false&width=600&lines=Upload+any+PDF+book;Have+natural+voice+conversations;AI+that+reads+and+understands+your+books;5+distinct+AI+voices+to+choose+from" alt="Typing SVG" /></a>

<br/><br/>

<p>
  <a href="#-getting-started"><img src="https://img.shields.io/badge/Get%20Started-663820?style=for-the-badge&logoColor=white" alt="Get Started" /></a>
  <a href="#-features"><img src="https://img.shields.io/badge/Features-212a3b?style=for-the-badge&logoColor=white" alt="Features" /></a>
  <a href="#-subscription-plans"><img src="https://img.shields.io/badge/Plans-47A248?style=for-the-badge&logoColor=white" alt="Plans" /></a>
</p>

<br/>

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,mongodb,tailwind&theme=dark" alt="Tech Stack" />
</p>

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## ✨ Features

- **PDF Upload & Processing** — Upload any PDF book. The app extracts text, generates a cover image from the first page, and splits content into searchable segments.
- **Voice Conversations** — Talk to an AI assistant that has read your entire book. Ask questions, discuss themes, request summaries — all through natural voice.
- **Real-Time Transcripts** — See your conversation as it happens with live speech-to-text and AI response streaming.
- **Multiple AI Voices** — Choose from 5 distinct ElevenLabs voices (Dave, Daniel, Chris, Rachel, Sarah) for each book.
- **Full-Text Search** — MongoDB text indexing with regex fallback enables the AI to find relevant passages instantly.
- **Subscription Plans** — Three-tier billing (Free, Standard, Pro) managed through Clerk Billing with plan enforcement on book uploads and voice sessions.
- **Cloud Storage** — PDFs and cover images stored on Vercel Blob for reliable, fast delivery.
- **Authentication** — Secure sign-in/sign-up powered by Clerk with protected routes.

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client — React 19"]
        UF["📄 Upload Form"]
        VC["🎤 Voice Chat<br/><small>VAPI SDK</small>"]
        PA["🔐 Pricing / Auth<br/><small>Clerk Components</small>"]
    end

    subgraph Server["⚡ Server — Next.js 16 App Router"]
        API1["/api/upload"]
        API2["/api/vapi/search-book"]
        SA["Server Actions<br/><small>books, sessions</small>"]
    end

    subgraph Services["☁️ External Services"]
        VB["Vercel Blob"]
        MDB["MongoDB Atlas"]
        CK["Clerk Auth + Billing"]
        VAPI["VAPI + ElevenLabs TTS"]
    end

    UF --> API1
    VC --> API2
    PA --> CK
    API1 --> VB
    API2 --> MDB
    SA --> MDB
    SA --> CK
    VC --> VAPI

    style Client fill:#663820,color:#fff,stroke:#663820
    style Server fill:#212a3b,color:#fff,stroke:#212a3b
    style Services fill:#1a1a2e,color:#fff,stroke:#1a1a2e
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- A MongoDB Atlas cluster
- Accounts on: [Clerk](https://clerk.com), [VAPI](https://vapi.ai), [Vercel](https://vercel.com) (for Blob storage)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/bookified.git
cd bookified
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Clerk Auth Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB
MONGODB_URI=mongodb+srv://...

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# VAPI Voice AI
NEXT_PUBLIC_ASSISTANT_ID=your_vapi_assistant_id
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 📁 Project Structure

```
bookified/
├── app/
│   ├── (root)/
│   │   ├── page.tsx             # Home — book library
│   │   ├── books/
│   │   │   ├── new/page.tsx     # Upload a new book
│   │   │   └── [slug]/page.tsx  # Book reader + voice chat
│   │   └── subscription/
│   │       └── page.tsx         # Pricing table
│   ├── api/
│   │   ├── upload/route.ts      # File upload to Vercel Blob
│   │   └── vapi/
│   │       └── search-book/route.ts  # VAPI tool — search book content
│   ├── globals.css              # Design system + component styles
│   └── layout.tsx               # Root layout with ClerkProvider
│
├── components/
│   ├── BookCard.tsx              # Book preview card
│   ├── HeroSection.tsx           # Homepage hero
│   ├── LoadingOverlay.tsx        # Full-screen loading state
│   ├── Navbar.tsx                # Navigation bar
│   ├── Transcript.tsx            # Real-time conversation display
│   ├── UploadForm.tsx            # PDF upload + metadata form
│   ├── VapiControls.tsx          # Voice session controls
│   └── ui/                       # shadcn/ui primitives
│
├── database/
│   ├── models/
│   │   ├── book.model.ts         # Book schema
│   │   ├── bookSegment.model.ts  # Text segment schema (searchable)
│   │   └── voiceSession.model.ts # Voice session tracking
│   └── mongoose.ts               # Connection with caching
│
├── hooks/
│   └── useVapi.ts                # Voice call lifecycle hook
│
├── lib/
│   ├── actions/
│   │   ├── book.actions.ts       # Book CRUD server actions
│   │   └── session.actions.ts    # Voice session server actions
│   ├── constants.ts              # App constants, voice config
│   ├── subscription-constants.ts # Plan limits & billing period
│   ├── subscription.ts           # Plan checks via Clerk has()
│   ├── utils.ts                  # PDF parsing, slug gen, helpers
│   └── zod.ts                    # Form validation schemas
│
├── types.d.ts                    # Global type definitions
└── public/assets/                # Static images & illustrations
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 💳 Subscription Plans

<div align="center">

| | **Free** | **Standard** | **Pro** |
|:--|:--:|:--:|:--:|
| | ![Free](https://img.shields.io/badge/free-4CAF50?style=for-the-badge) | ![Standard](https://img.shields.io/badge/standard-2196F3?style=for-the-badge) | ![Pro](https://img.shields.io/badge/pro-663820?style=for-the-badge) |
| **Books** | 5 | 10 | 100 |
| **Voice Sessions / Month** | 5 | 100 | Unlimited |
| **Max Session Duration** | 15 min | 30 min | 60 min |

</div>

> Plans are configured in the Clerk Dashboard with slugs `free_user`, `standard`, and `pro`. Enforcement happens server-side in the book creation and session start actions using Clerk's `has()` method.

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 🔊 How Voice Conversations Work

```mermaid
flowchart LR
    A["🎤 User speaks"] --> B["📝 VAPI transcribes"]
    B --> C["🧠 LLM processes"]
    C --> D["🔍 Search book segments"]
    D --> E["📚 MongoDB returns passages"]
    E --> F["💬 AI generates response"]
    F --> G["🔊 ElevenLabs speaks"]
    G --> H["📜 Live transcript"]

    style A fill:#663820,color:#fff,stroke:#663820
    style B fill:#212a3b,color:#fff,stroke:#212a3b
    style C fill:#663820,color:#fff,stroke:#663820
    style D fill:#212a3b,color:#fff,stroke:#212a3b
    style E fill:#47A248,color:#fff,stroke:#47A248
    style F fill:#663820,color:#fff,stroke:#663820
    style G fill:#212a3b,color:#fff,stroke:#212a3b
    style H fill:#663820,color:#fff,stroke:#663820
```

<details>
<summary><strong>Step-by-step breakdown</strong></summary>

1. User opens a book and clicks the microphone button
2. A `VoiceSession` record is created (after plan limit checks)
3. The VAPI SDK connects to the configured AI assistant with the selected ElevenLabs voice
4. When the user speaks, VAPI transcribes and sends to the LLM
5. The LLM calls the `/api/vapi/search-book` tool to find relevant book passages
6. MongoDB text search (with regex fallback) returns the top matching segments
7. The AI generates a contextual response, which is spoken back via ElevenLabs TTS
8. The full transcript is displayed in real-time on screen

</details>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 🛠️ Tech Stack

| Layer          | Technology                                              |
|----------------|---------------------------------------------------------|
| Framework      | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI             | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| Language       | [TypeScript 5](https://www.typescriptlang.org)          |
| Database       | [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose 9](https://mongoosejs.com) |
| Auth & Billing | [Clerk](https://clerk.com) (authentication + subscription billing) |
| Voice AI       | [VAPI](https://vapi.ai) (orchestration) + [ElevenLabs](https://elevenlabs.io) (TTS) |
| File Storage   | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| PDF Parsing    | [PDF.js](https://mozilla.github.io/pdf.js/) (client-side) |
| Forms          | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 📜 Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start development server       |
| `npm run build` | Create production build         |
| `npm start`     | Start production server         |
| `npm run lint`  | Run ESLint                      |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 🚢 Deployment

The app is designed for [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project in the Vercel dashboard
3. Add all environment variables from `.env.local`
4. Deploy — Vercel handles the build, SSR, and Blob storage automatically

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12&height=2" width="100%" />

## 📄 License

This project is for educational and personal use.

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:663820,100:212a3b&height=120&section=footer&animation=fadeIn" width="100%" />

<br/>

<p>
  <a href="#"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=14&pause=1000&color=663820&center=true&vCenter=true&random=false&width=400&lines=Built+with+%E2%9D%A4%EF%B8%8F+by+Rabeet+Ahmer" alt="Footer" /></a>
</p>

</div>
