# AIFA GEN LABS Admin Portal

<div align="center">

![AIFA GEN LABS Console](https://img.shields.io/badge/AIFA_GEN_LABS-Career_Optimization-EA580C?style=for-the-badge&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Automated Tests](https://img.shields.io/badge/Tests-46%2F46_Passing_(100%25)-16A34A?style=for-the-badge)

<p align="center">
  <strong>Career Optimization • Better intelligence. Better decisions.</strong>
</p>

<p align="center">
  An enterprise-grade, fully responsive SaaS administrative console designed for intelligent recruitment operations, candidate discovery, multi-source job ingestion telemetry, recruiter performance benchmarking, financial ledgers, and multimodal conversational AI.
</p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Enterprise Feature Matrix](#-enterprise-feature-matrix)
  - [1. Modern SaaS Sign-In & Security](#1-modern-saas-sign-in--security)
  - [2. Adaptive Navigation Architecture](#2-adaptive-navigation-architecture)
  - [3. Multimodal AI Operations Assistant (Voice + Chat)](#3-multimodal-ai-operations-assistant-voice--chat)
  - [4. Executive Command Center & Telemetry](#4-executive-command-center--telemetry)
  - [5. Candidate Directory & ATS Optimization](#5-candidate-directory--ats-optimization)
  - [6. Multi-Source Job Ingestion Engine](#6-multi-source-job-ingestion-engine)
  - [7. Recruiter Performance & Benchmarking](#7-recruiter-performance--benchmarking)
  - [8. Financial Ledger & Billing Operations](#8-financial-ledger--billing-operations)
  - [9. White-Label Branding & System Settings](#9-white-label-branding--system-settings)
  - [10. Fully Responsive Mobile-First Architecture](#10-fully-responsive-mobile-first-architecture)
- [Voice Agent Processing Pipeline](#-voice-agent-processing-pipeline)
- [Tech Stack](#-tech-stack)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Administrator Credentials](#-default-administrator-credentials)
- [Automated Verification & Test Suites](#-automated-verification--test-suites)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Project Directory Structure](#-project-directory-structure)

---

## 🚀 Overview

**AIFA GEN LABS Admin Portal** is an end-to-end recruitment operations platform built for global talent agencies, hiring teams, and career optimization operations. It unifies high-volume job scraping feeds, candidate tracking, ATS resume matching, billing management, and real-time voice-driven AI telemetry into a cohesive, high-performance web console.

### Key Value Pillars
- **Zero-Latency Ingestion Telemetry**: Live tracking of 18,450+ vacancies across LinkedIn, Indeed, Greenhouse, Lever, and Workday.
- **Multimodal AI Assistant**: Conversational data intelligence that operates seamlessly in typed text or real-time spoken audio.
- **Enterprise-Grade Security**: Cryptographically signed HMAC sessions, role-based protection guards, and audit trails.
- **Responsive Across Any Viewport**: Fully responsive experience on smartphones (360px+), tablets, laptops, and 4K displays.

---

## 🌟 Enterprise Feature Matrix

### 1. Modern SaaS Sign-In & Security
- **Cinematic Dual-Zone Architecture**: Calm, high-contrast split-screen login page pairing a subtle brand video showcase (`career-optimization-bg.mp4`) with a pure white SaaS sign-in card.
- **Cryptographic Session Authentication**: Signed HMAC session tokens with tamper detection and automated expiration handling.
- **Configurable Persistence**: 30-day persistent session support via `localStorage` ("Remember Me") or scoped ephemeral sessions via `sessionStorage`.
- **One-Click Demo Auto-Fill**: Quick-fill button on the login card to populate test credentials instantly.
- **Protected Routing & Route Guards**: Navigation guards on `/dashboard`, `/users`, `/jobs`, `/payments`, `/recruiters`, and `/settings` that safely redirect unauthenticated requests to `/login`.

### 2. Adaptive Navigation Architecture
- **Desktop Slim Icon Rail (Hover Expansion)**: Space-efficient 64px rail that smoothly expands to a 256px drawer on hover, displaying organized categories, live search, and account status without interrupting workflow.
- **Mobile Off-Canvas Drawer**: On smartphones and tablets (`< 768px`), the fixed rail transitions into an off-canvas slide-out drawer triggered by a header hamburger menu with backdrop blur.
- **Global Command Search (`Cmd + K`)**: Unified instant search querying pages, candidates, active jobs, and recruiter profiles simultaneously with keyboard navigation support.
- **Real-Time Feed Synchronizer**: Top-bar action button triggering live scraper synchronization across all external job connectors.
- **Notification Center**: Centralized bell indicator displaying live platform alerts, sync logs, and system events.

### 3. Multimodal AI Operations Assistant (Voice + Chat)
- **Dual-Mode Experience**: Instant switching between `[ Chat ]` and `[ Voice ]` modes while preserving complete conversation history.
- **Grounded Conversational Intelligence**: Powered by Groq LLM (`openai/gpt-oss-120b`) grounded in real-time portal telemetry, paired with an offline deterministic semantic NLU parser.
- **Real-Time Voice Agent**:
  - Uses browser-native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`, `speechSynthesis`).
  - **Natural Spoken Delivery**: Directly speaks candidate, recruiter, or job names (e.g., *"Found 3 users currently enrolled in the Basic plan: Tariq Mansoor, Liam O'Connor, and Daisuke Tanaka"*).
  - **Noise Suppression**: Excludes raw markdown tables, database column headers, IDs, and email addresses from spoken output while keeping full structured data visible on screen.
  - **Safe Single-Turn Mic**: Automatic listening state transitions with single-utterance speech capture to avoid open-mic background noise.
  - **Interruption Controls**: Dedicated "Stop Speaking" button, and auto-abort on mode switch or panel close.

### 4. Executive Command Center & Telemetry
- **Core Platform KPIs**: Real-time metrics for Total Candidates (`4,820`), Active Subscriptions (`1,420`), Monthly Recurring Revenue (`$142,850.00`), and Jobs Ingested (`18,450`).
- **Interactive Performance Charts**: 30-day interactive velocity tracking comparing candidate registrations against collected revenue.
- **Top Job Sources Breakdown**: Visual market-share analytics across LinkedIn (42%), Indeed (28%), Naukri (15%), and ATS feeds.
- **Recent Platform Activity Feed**: Live audit trail of system events, subscription renewals, candidate registrations, and sync errors.

### 5. Candidate Directory & ATS Optimization
- **Directory & Multi-Factor Filtering**: Search candidates by name, email, target country, subscription tier (`Basic`, `Premium`, `None`), and account status (`Active`, `Past Due`, `Suspended`).
- **ATS Optimization Scoring**: Dynamic candidate match scores (0–100%) and career target country benchmarks.
- **Invoice & PDF Generation**: Integrated invoice preview modal and instant PDF download powered by `jspdf` and `html2canvas`.
- **Impersonation & Account Actions**: Safe administrative actions to inspect candidate profiles, update tiers, or adjust account status.

### 6. Multi-Source Job Ingestion Engine
- **Active Scraper Connectors**: Ingestion pipelines supporting LinkedIn Global, Indeed, Greenhouse, Lever, and Workday.
- **Health & Diagnostic Telemetry**: 7-day ingestion volume (`364+ jobs`), sync success rate (`72.7%`), and diagnostic alerts for connector errors (e.g., Greenhouse HTTP 403 Forbidden, Lever Queue Timeout).
- **Automated Deduplication**: Anomaly detection engine that identifies and merges duplicate postings across feeds.
- **Dual-Section Reporting**: Generates formatted CSV and PDF reports containing jobs listings alongside connector telemetry KPIs.

### 7. Recruiter Performance & Benchmarking
- **Talent Partner Benchmarking**: Workload distribution, candidate submission funnels, and placement conversion rates across talent partners (team average: `37.1%`).
- **Zero-Placement Accountability**: Automated alerts flagging recruiters with zero placements within the active 30-day evaluation window.
- **Staff Management**: Add, update, or reassign recruiters across engineering, sales, and executive departments.

### 8. Financial Ledger & Billing Operations
- **Transaction History**: Searchable financial ledger tracking invoice IDs, candidate details, billing dates, payment methods (Credit Card, PayPal, Wire), and statuses (`Succeeded`, `Pending`, `Refunded`).
- **Refund Management**: Secure administrative modal to process partial or full refunds with instant status updates.
- **Revenue Analytics**: Plan revenue distribution breakdown between Premium ($149/mo), Basic ($45/mo), and enterprise accounts.

### 9. White-Label Branding & System Settings
- **Live Brand Preview**: Real-time branding editor with instant preview of company logo, platform name, and corporate tagline.
- **Audit Log Retention Policies**: Configurable data retention periods (30, 90, 180, 365 days) with one-click audit trail CSV export.
- **Security & Access Control**: Password policy controls, two-factor authentication toggles, and session timeout parameters.

### 10. Fully Responsive Mobile-First Architecture
- **Fluid Layout**: Automatic transition between desktop split screens, responsive tablet grids, and single-column mobile flows.
- **Mobile Navigation Drawer**: Smooth slide-out mobile drawer with backdrop blur and touch-optimized navigation targets.
- **Responsive AI Assistant**: Adapts from a desktop floating card to a full-width mobile bottom drawer (`max-h-[calc(100dvh-5.5rem)]`) and full-screen expanded dialog.
- **Responsive Tables**: Every data table includes an `overflow-x-auto` wrapper with custom scrollbars, preventing horizontal page clipping.

---

## 🎙️ Voice Agent Processing Pipeline

```
       User Speaks Question
                 │
                 ▼
     [ Web Speech Recognition ]
  (Speech-to-Text in the browser)
                 │
                 ▼
       Recognized Query Text
                 │
                 ▼
  [ Unified Submission Pipeline ] ◄── (Identical to typed Chat mode)
                 │
                 ▼
  [ Groq LLM + Local Grounding ]
                 │
                 ▼
      Actual Assistant Response
                 │
        ┌────────┴────────┐
        ▼                 ▼
 [ Render on Screen ]  [ Spoken Audio Engine ]
 (Full tables, data,   • Clean markdown noise
  metadata preserved)  • Speak candidate / job names directly
                       • Suppress raw IDs, tables, and emails
                       • Play via window.speechSynthesis
```

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Concurrent rendering, modern hooks, and state management |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Fast HMR, production chunking, and bundle optimization |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Atomic utility classes, CSS variables, and dark/light themes |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography across navigation, actions, and KPIs |
| **PDF & Export** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) | Client-side invoice rendering and telemetry report export |
| **AI / LLM** | [Groq Cloud](https://groq.com/) | High-speed inference using `openai/gpt-oss-120b` |
| **Speech APIs** | Web Speech API | Native `SpeechRecognition` and `SpeechSynthesis` |
| **Linter** | [Oxlint](https://oxc.rs/) | Rust-based high-performance linter (0 warnings, 0 errors) |
| **Test Runner** | Node.js ESM | Native test runner (`node:assert`) across 46 verification cases |
| **Deployment** | [Vercel](https://vercel.com/) | Native Vite preset with clean URL rewrites via `vercel.json` |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`

### 1. Clone & Navigate
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd admin_portal/admin_portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy the example environment configuration:
```bash
cp .env.example .env
```
Add your Groq API key (optional for live AI queries):
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
PORT=5174
```
*(Note: If no API key is supplied, the portal's built-in deterministic semantic NLU engine operates with 100% offline accuracy.)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 🔑 Default Administrator Credentials

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Email** | `admin@aifagen@gmail.com` | Primary administrator account *(or alias `admin@aifagen.com`)* |
| **Password** | `admin@123` | Default administrative passphrase |
| **Role** | Super Administrator | Full access to telemetry, billing, and settings |

> **Pro Tip**: On the sign-in page, click **"Auto-fill"** to automatically populate these credentials with a single click.

---

## 🧪 Automated Verification & Test Suites

The platform includes 4 automated test suites covering authentication, voice processing, AI reasoning, and data queries.

### Run All Tests (46/46 Passing)
```bash
npm test
```

### Run Individual Test Suites
```bash
# Voice Assistant & Real-Time Voice Agent Suite (17 scenarios)
npm run test:voice

# Authentication, Session Persistence & Route Guards Suite (14 scenarios)
npm run test:auth

# Conversational AI Loop & Telemetry Reporting Suite (8 scenarios)
npm run test:conversational
```

### Code Quality & Build Checks
```bash
# Run Rust-based Oxlint
npm run lint

# Compile production bundle
npm run build
```

---

## ☁️ Vercel Deployment Guide

The repository includes a pre-configured [vercel.json](file:///Users/sathwikchelloju/Desktop/Admin/admin_portal/admin_portal/vercel.json) that automatically handles single-page application (SPA) client-side routing and immutable asset caching.

### Deploy Steps
1. Push your repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Vercel automatically detects the Vite framework:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* Add the environment variable:
   - `VITE_GROQ_API_KEY`: `your_groq_api_key`
6. Click **Deploy**.

All routes (`/login`, `/dashboard`, `/users`, `/jobs`, `/payments`, `/settings`) resolve cleanly with zero 404 reload errors.

---

## 📁 Project Directory Structure

```
admin_portal/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (lint, 46 tests, build)
├── public/                      # Static branding assets & video
│   ├── assets/
│   │   └── career-optimization-bg.mp4
│   ├── aifa-logo.png
│   └── favicon.ico
├── server/                      # Local API services & cryptographic auth signer
│   ├── aiService.js             # Groq API caller & semantic fallback
│   ├── authService.js           # HMAC cryptographic token manager
│   ├── contextBuilder.js        # Runtime portal telemetry context aggregator
│   └── index.js                 # API server entry point
├── src/
│   ├── assets/                  # Brand icons and illustrations
│   ├── components/              # GlobalSearchBar, Tooltip, UI primitives
│   ├── context/                 # AuthContext, SettingsContext
│   ├── features/
│   │   ├── ai-usage/            # AI compute tokens & inference cost tracking
│   │   ├── assistant/           # Multimodal AI Assistant (Voice + Chat)
│   │   ├── audit-logs/          # System audit trails & security logs
│   │   ├── auth/                # SaaS sign-in page & session client
│   │   ├── dashboard/           # Executive KPI overview & activity charts
│   │   ├── job-sources/         # Scraper feeds & connector diagnostics
│   │   ├── jobs/                # Vacancy directory & multi-source search
│   │   ├── overview/            # Performance analytics & growth metrics
│   │   ├── payments/            # Financial ledger, invoices & refund modals
│   │   ├── recruiters/          # Recruiter performance & benchmark funnels
│   │   ├── settings/            # White-label branding & security settings
│   │   └── users/               # Candidate management & subscription tiers
│   ├── hooks/                   # useAuth, useVoiceAssistant, useToast
│   ├── layouts/                 # AdminLayout (responsive rail & mobile drawer)
│   ├── mocks/                   # Authoritative in-memory state store
│   ├── App.jsx                  # Top-level routing & session controller
│   ├── index.css                # Design tokens & Tailwind styles
│   └── main.jsx                 # Application entry point
├── tests/                       # Node.js automated test suites
│   ├── test_ai_assistant_suite.mjs
│   ├── test_authentication_suite.mjs
│   ├── test_conversational_suite.mjs
│   ├── test_simple_architecture.mjs
│   └── test_voice_assistant_suite.mjs
├── .env.example                 # Environment configuration template
├── package.json                 # Node dependencies & scripts
├── vercel.json                  # Vercel SPA routing & caching rules
└── vite.config.js               # Vite build & plugin configuration
```

---

## 🛡️ License & Trademarks

Copyright © 2026 **AIFA GEN LABS**. All rights reserved.  
*Career Optimization is a registered trademark of AIFA GEN LABS.*
