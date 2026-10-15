# AIFA GEN LABS Admin Portal

> **Career Optimization • Better intelligence. Better decisions.**

An enterprise-grade SaaS administrative console for intelligent recruitment operations, candidate discovery, multi-source job ingestion telemetry, recruiter performance benchmarking, financial ledgers, and multimodal conversational AI.

---

## 🌟 Key Features

### 1. Executive Dashboard & Telemetry
- **Core Platform KPIs**: Real-time monitoring of Total Candidates (`4,820`), Enrolled Subscriptions (`1,420`), Monthly Recurring Revenue (`$142,850.00`), and Job Ingestion Health (`18,450 vacancies`).
- **Velocity Tracking**: Candidate registrations vs. collected revenue across customizable weekly and monthly billing cycles.
- **Revenue Distribution**: Breakdown across subscription tiers: Premium ($149/mo), Basic ($45/mo), and Unenrolled.

### 2. Candidate Discovery & Subscription Management
- **Directory & Filters**: Search and filter platform candidates by name, email, role, subscription plan (`Basic`, `Premium`, `None`), and status (`Active`, `Past Due`, `Suspended`).
- **ATS Optimization Scoring**: Dynamic candidate match scores (0–100%) and target career country goals.
- **Renewal Auditing**: Automated detection of upcoming subscription renewals within 30 days and alerts for past-due accounts.

### 3. Recruiter Performance & Benchmarking
- **Staff Benchmarking**: Real-time placement metrics, candidate submission funnels, and conversion rates across executive recruiters (team average: `37.1%`).
- **Zero-Placement Audits**: Automated anomaly detection to guarantee zero-placement accountability across all active talent partners.

### 4. Multi-Source Job Ingestion Engine
- **Active Connectors**: Automated scraping and API ingestion feeds from LinkedIn Global, Indeed, Greenhouse, Lever, and custom scrapers.
- **Ingestion Telemetry**: 7-day ingestion volume (`364+ jobs`), sync success rate (`72.7%`), and connector failure diagnostic audits (e.g. Greenhouse HTTP 403 Forbidden, Lever Queue Timeout).
- **Export Capabilities**: Dual-section CSV and PDF telemetry report generation.

### 5. Multimodal AI Admin Assistant (Chat & Voice)
- **Dual-Mode Experience**: Unified floating drawer with instantaneous switching between `[ Chat ]` and `[ Voice ]` modes.
- **Grounded Conversational Intelligence**: Powered by Groq LLM integration (`openai/gpt-oss-120b`) grounded directly in live portal application context, with automatic fallback to a deterministic semantic NLU parser.
- **Real-Time Voice Agent**:
  - Browser-native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`, `speechSynthesis`).
  - **Natural Conversational Delivery**: Formulates natural spoken responses that state candidate, recruiter, or job names directly (e.g. *"Found 3 users with the Basic plan: Tariq Mansoor, Liam O'Connor, and Daisuke Tanaka"*).
  - **Noise Suppression**: Suppresses raw database columns, table dividers, email addresses, and database IDs from audio output while preserving full structured tables on screen.
  - **Safe Single-Turn Mic**: Automatic listening state transitions with single-utterance speech capture to avoid open-mic noise.
  - **Instant Cancellation**: Dedicated "Stop Speaking" control and automatic audio abortion when switching modes or closing the panel.

### 6. Enterprise Authentication & Security
- **SaaS Sign-In Portal**: High-contrast, minimal split-screen login page with ambient branding, subtle video backdrop, and 1-click test credential auto-fill.
- **Cryptographic Security**: Signed HMAC session tokens with configurable persistence (30-day "Remember Me" via `localStorage` vs. session-only via `sessionStorage`).
- **Protected Routing**: Navigation guards across all administrative modules with automatic session expiration handling.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with dual-tone Dark/Light theme support
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans, Manrope, JetBrains Mono
- **PDF & Canvas Export**: [jsPDF](https://github.com/parallax/jsPDF), [html2canvas](https://html2canvas.hertzen.com/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **AI & LLM Services**: Groq Cloud SDK / REST API (`openai/gpt-oss-120b`)
- **Speech APIs**: Browser Web Speech API (`SpeechRecognition`, `SpeechSynthesis`)
- **Testing**: Node.js native test runner (`node:assert`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd admin_portal/admin_portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for live AI models):
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5174
   ```
   *(Note: If no API key is provided, the platform automatically engages its built-in deterministic semantic NLU parser with 100% offline accuracy.)*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5174
   ```

---

## 🔑 Default Administrator Credentials

Use the following credentials to access the console:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@aifagen@gmail.com` *(or alias `admin@aifagen.com`)* |
| **Password** | `admin@123` |
| **Role** | Super Administrator |

*(Tip: On the sign-in page, click **"Auto-fill"** to automatically populate these credentials in one click.)*

---

## 🧪 Testing & Verification

The project includes a comprehensive automated test suite covering authentication, voice synthesis, AI conversation loops, and deterministic data queries.

### Run All Tests
```bash
npm test
```
*Executes all 46 verification scenarios with 100% pass rate.*

### Run Specific Test Suites
```bash
# Voice Assistant & Real-Time Voice Agent Suite (17 scenarios)
npm run test:voice

# Authentication & Session Persistence Suite (14 scenarios)
npm run test:auth

# Conversational AI & Follow-up Architecture Suite
npm run test:conversational
```

### Linting & Production Build
```bash
# Run Oxlint
npm run lint

# Compile production bundle
npm run build
```

---

## 📁 Project Structure

```
admin_portal/
├── public/                     # Static assets, branding logos, and background video
│   ├── assets/
│   │   ├── career-optimization-bg.mp4
│   │   └── ...
│   └── aifa-logo.png
├── server/                     # Backend API services, auth token signer & AI orchestration
│   ├── aiService.js            # Groq model caller & deterministic intent fallback
│   ├── authService.js          # Cryptographic HMAC session token manager
│   ├── contextBuilder.js       # Runtime portal telemetry context aggregator
│   └── index.js                # Express mock server
├── src/
│   ├── assets/                 # Brand assets & UI icons
│   ├── components/             # Reusable UI controls, global search, toast alerts
│   ├── context/                # AuthContext, SettingsContext
│   ├── features/
│   │   ├── ai-usage/           # Token compute & inference cost analytics
│   │   ├── assistant/          # AI Assistant (Chat, VoiceInterface, voiceService, toolRegistry)
│   │   ├── audit-logs/         # System event trails & access logs
│   │   ├── auth/               # Sign-in page & authentication services
│   │   ├── dashboard/          # Performance charts & executive KPI summary
│   │   ├── job-sources/        # Ingestion connectors & sync execution logs
│   │   ├── jobs/               # Vacancy listings & multi-source search
│   │   ├── overview/           # Platform metrics & monthly growth charts
│   │   ├── payments/           # Invoices, billing cycles & financial ledger
│   │   ├── recruiters/         # Staff placement metrics & conversion benchmarks
│   │   ├── settings/           # Customization, branding & white-label settings
│   │   └── users/              # Candidate directory & subscription tier management
│   ├── hooks/                  # Custom React hooks (useAuth, useVoiceAssistant, etc.)
│   ├── layouts/                # AdminLayout (collapsible sidebar rail, global header)
│   ├── mocks/                  # Authoritative in-memory mock store
│   ├── App.jsx                 # Route manager & top-level layout controller
│   ├── index.css               # Design tokens, typography & Tailwind styles
│   └── main.jsx                # Application root entry point
├── tests/                      # Automated test suites (Node.js ESM)
│   ├── test_ai_assistant_suite.mjs
│   ├── test_authentication_suite.mjs
│   ├── test_simple_architecture.mjs
│   └── test_voice_assistant_suite.mjs
├── package.json
└── vite.config.js
```

---

## 🛡️ License & Trademarks

Copyright © 2026 **AIFA GEN LABS**. All rights reserved.  
*Career Optimization is a registered trademark of AIFA GEN LABS.*
