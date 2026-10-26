# Sameerly — Meta-Style Lead Generation & Client Acquisition Platform

[![Production Ready](https://img.shields.io/badge/Production-Ready-success.svg)](#)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.15-blue.svg)](https://nextjs.org/)
[![Design](https://img.shields.io/badge/Design-Glassmorphism%20%7C%20Meta%20Style-1877F2.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

**Sameerly** is a production-grade client acquisition and lead generation engine engineered with a luxury **Meta (Facebook) glassmorphism dashboard** layout. It aggregates freelance gigs and local businesses from **Google My Business (GMB)**, **Upwork**, **Bark**, **LinkedIn**, and specialized design/video job boards.

---

## 🌟 Key Features

1. **Google My Business (GMB) Explorer with Business Age Detector**:
   - Accurately computes how many years and months each business has been operating.
   - Highlights badges:
     - `✨ Newly Opened (< 1 Year)` (Emerald green pulse)
     - `🌱 Rising Business (1 - 3 Years)`
     - `⭐ Established (3 - 5 Years)`
     - `🏆 Veteran Business (5+ Years)`
   - Detects **Missing Online Presence**: If a business has no website, Sameerly flags it as a high-conversion redesign lead opportunity!

2. **Automated Client Website Generator**:
   - Synthesizes a luxury, responsive, mobile-optimized landing page tailored to the client's business niche (dental clinic, marble supplier, law chambers, video agency, SaaS).
   - Generates bespoke hero sections, service grids, testimonials, and contact forms.
   - Live interactive preview in `/preview/[id]` with one-click theme switcher (`Meta Blue`, `Emerald Health`, `Luxury Gold`, `Modern Studio`).
   - Generates standalone compiled HTML export ready to deploy.

3. **Direct Contact & Outreach Engine**:
   - Direct click-to-call (`tel:`) and instant WhatsApp chat links.
   - Meta Messenger-style cold outreach composer with pre-crafted high-converting pitch templates:
     - *Website Redesign & Growth Pitch*
     - *Short-Form Video & Reels Retainer*
     - *Brand Identity & Packaging Overhaul*
   - Automatically attaches the live generated website preview URL to the email!

4. **Multi-Territory Filtering**:
   - 🇵🇰 **Pakistan Local Market**: Lahore (DHA, Gulberg), Karachi (Clifton, DHA), Islamabad (Blue Area, F-7).
   - 🇺🇸 **United States**: Austin, San Francisco, Miami, Denver, New York.
   - 🇬🇧 **United Kingdom**: London (Harley Street, Canary Wharf), Manchester, Edinburgh.
   - 🌍 **Global Remote Marketplace**.

5. **API Quota Safety & Graceful Fallback Engine**:
   - In-memory rate limiting and hourly quota tracking for all external services.
   - If an API key is missing or quota is exhausted, Sameerly automatically falls back to public open-data feeds and high-fidelity local datasets without downtime or crashing.

---

## 🎨 Design System: Meta Glassmorphism

- **Luxury White Palette**: High-contrast, crystal clean slate background (`#F0F2F5` gradient).
- **Frosted Glass Panels**: Semi-translucent panels (`backdrop-blur-md bg-white/80 border border-white/80`).
- **Meta-Blue Accents**: Iconic royal blue `#1877F2` for primary actions, subtle badges, and verified ticks.
- **3-Column Feed Architecture**:
  - *Left Sidebar*: Workspaces, territory presets, and hot lead alerts.
  - *Center Feed*: Real-time lead posts, filters, search bar, and interactive generator.
  - *Right Sidebar*: Real-time quota tracker, pipeline metrics, and one-click search presets.

---

## 📁 Project Structure

```
Lead-Gen Portal/
├── .env.example                # Documented list of environment variables
├── .env.local                  # Local environment file
├── Dockerfile                  # Multi-stage production Docker container
├── docker-compose.yml          # Container orchestration configuration
├── next.config.js              # Next.js webpack alias and optimization
├── tailwind.config.js          # Glassmorphism & Meta theme definitions
├── tsconfig.json               # TypeScript strict configuration
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── generate-website/   # POST: Synthesizes luxury landing page
    │   │   ├── gmb/                # GET: Google My Business places search
    │   │   ├── jobs/               # GET: Freelance marketplace job aggregator
    │   │   ├── leads/              # GET: Unified leads feed with multi-filters
    │   │   ├── outreach/send-email/# POST: Nodemailer/Resend email dispatch
    │   │   └── quotas/             # GET: Live rate limits & quota monitor
    │   ├── preview/[id]/           # Standalone live preview of client websites
    │   ├── globals.css             # Glassmorphism utilities & Meta scrollbars
    │   ├── layout.tsx              # Root HTML & metadata layout
    │   └── page.tsx                # Main Meta dashboard view
    ├── components/
    │   ├── ApiSettingsModal.tsx    # Live quota monitor & API key guidance
    │   ├── EmailOutreachModal.tsx  # Cold email pitch composer
    │   ├── FiltersBar.tsx          # Country, Category, Age, & Channel filters
    │   ├── GmbExplorer.tsx         # Dedicated GMB local business analyzer
    │   ├── JobsExplorer.tsx        # Bark/Upwork/LinkedIn marketplace hub
    │   ├── LeadCard.tsx            # Meta-styled post card with age badge
    │   ├── Navbar.tsx              # Meta top navigation with search & status
    │   ├── RightSidebar.tsx        # Live quota safety & pipeline analytics
    │   ├── Sidebar.tsx             # Left menu & country selector presets
    │   └── WebsiteGeneratorModal.tsx # Interactive generator preview
    ├── lib/
    │   ├── gmb-age-calculator.ts   # Accurate business age computation
    │   ├── gmb-service.ts          # GMB Places API + fallback engine
    │   ├── jobs-service.ts         # Public job board API integration
    │   ├── mailer.ts               # Resend / Nodemailer / Sandbox mailer
    │   ├── mock-data.ts            # Realistic Pakistan, US, & UK market leads
    │   ├── rate-limiter.ts         # Quota tracking & safety limiter
    │   └── website-generator.ts    # Template compiler & HTML exporter
    └── types/
        └── index.ts                # TypeScript interfaces
```

---

## 🔑 Free-Tier API Keys Guide

Sameerly works **immediately out-of-the-box** without any keys because it has a built-in sandbox and fallback engine. To enable live external fetching, obtain free-tier keys below:

| Service | Free Tier Allowance | Where to Get | Environment Variable | Fallback When Key Is Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **Google Places API** | **$200 free credit monthly** (~28,000 requests) | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | `GOOGLE_PLACES_API_KEY` | High-fidelity verified local business dataset + Overpass |
| **SerpApi** | **100 free searches/month** | [SerpApi.com](https://serpapi.com/) | `SERPAPI_API_KEY` | Public RSS & direct aggregator feeds |
| **Public Job Feeds** | **100% Free & Unlimited** | Built-in (Remotive/Adzuna) | None needed | Active by default |
| **Resend Email** | **3,000 free emails/month** | [Resend.com](https://resend.com/) | `RESEND_API_KEY` | SMTP or Sandbox Simulation mode (logs full payload) |
| **Standard SMTP** | **500 free emails/day** via Gmail App Password | [Google Account Security](https://myaccount.google.com/apppasswords) | `SMTP_USER`, `SMTP_PASS` | Sandbox Simulation mode |

### Setting Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your desired keys. If left empty, Sameerly runs in seamless sandbox mode.

---

## 🚀 Quickstart & Installation

### Requirements
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm** or **pnpm** / **yarn**

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment

A multi-stage production Docker setup is included:

```bash
# Build and run with Docker Compose
docker compose up -d --build

# Check logs
docker compose logs -f
```
The app will be available at `http://localhost:3000`.

---

## 🛡️ Security & Reliability

- **API Key Safety**: No keys are exposed to the client bundle. All requests pass through secure server-side Next.js route handlers (`/api/...`).
- **Input Sanitization**: Email payloads and search parameters are validated before dispatch.
- **Rate Limit Protection**: Built-in quota tracker prevents hitting external service caps.
- **Fail-Safe Design**: Guaranteed zero crashing even if an external API is down or quota-exhausted.
