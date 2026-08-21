# ScrapeFlow 🚀 — Visual Web Scraping & Automation Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Flow](https://img.shields.io/badge/Workflow-React_Flow-ff0072?style=flat-square)](https://reactflow.dev/)
[![Puppeteer](https://img.shields.io/badge/Automation-Puppeteer-00D8A2?style=flat-square&logo=puppeteer)](https://pptr.dev/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square)](https://clerk.com/)

ScrapeFlow is a visual web scraper and browser automation platform built with **Next.js 14**, **React Flow**, **Puppeteer**, **SQLite/PostgreSQL**, and **Prisma**. Create, manage, schedule, and execute multi-step scraping workflows through a visual drag-and-drop node graph with real-time phase logs and AI-driven data extraction.

---

## 🌐 Live Demo & Deployment

- **Live URL**: *(Add your deployed URL here if available, e.g., `https://scrapeflow.vercel.app`)*
- **Deployment Guide**: Check out [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) & [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

---

## ✨ Features

- 🎨 **Visual Workflow Builder**: Intuitive node-based canvas powered by React Flow for chaining scrapers, browser interactions, and transformations.
- ⚡ **Headless Browser Automation**: Full Puppeteer engine with Chromium support, navigation control, mouse interactions, and form inputs.
- 🤖 **AI-Powered Data Extraction**: Integrate OpenAI GPT models to extract structured JSON directly from raw HTML layouts.
- ⏱️ **Workflow Scheduling**: Automated cron jobs for executing routines periodically in the background.
- 🔐 **Secure Credential Vault**: AES-encrypted credential and API token storage for sensitive accounts.
- 📡 **Webhook & API Delivery**: Real-time webhook dispatching with auto-retries to funnel scraped data into external APIs.
- 💳 **Credit & Usage Management**: Built-in consumption tracker, rate limits, and Stripe billing integration.
- 📊 **Real-time Phase Logs & History**: Granular per-node execution telemetry, status updates, and historical run inspection.

---

## 📸 Screenshots

### Visual Workflow Builder
![Screenshot 1](https://github.com/user-attachments/assets/07105297-8b67-4419-a92f-ef5ff5a038c6)

### Workflow Execution & Monitoring
![Screenshot 2](https://github.com/user-attachments/assets/ecf9c093-d03e-4ee0-bd71-48f1d0b38538)

---

## 🛠️ Workflow Task Modules

| Category | Available Task Nodes |
| :--- | :--- |
| **Browser Control** | `Launch Browser`, `Navigate to URL`, `Scroll to Element`, `Wait for Element` |
| **Data Extraction** | `Page to HTML`, `Extract Text from Element` (Cheerio), `Extract Data via AI` (OpenAI GPT) |
| **Page Interaction**| `Fill Input`, `Click Element`, `Keyboard Press`, `Delay / Sleep` |
| **Data Processing** | `Read JSON`, `Build JSON`, `Filter & Transform` |
| **Delivery & Output**| `Deliver via Webhook` |

---

## 📦 Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **UI / Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Workflow Canvas**: [@xyflow/react (React Flow)](https://reactflow.dev/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite / PostgreSQL
- **Authentication**: [Clerk](https://clerk.com/)
- **Automation & Scraping**: [Puppeteer](https://pptr.dev/), [Cheerio](https://cheerio.js.org/)
- **AI Integration**: [OpenAI API](https://openai.com/)
- **Payments**: [Stripe](https://stripe.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vamshavardhan50/ScrapeFlow.git
   cd ScrapeFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your required variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Encryption (32-character key)
   ENCRYPTION_SECRET="your-32-character-encryption-key"

   # Optional (for AI / Stripe / Production Browser)
   OPENAI_API_KEY="sk-..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   BROWSER_WS_ENDPOINT=""
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## 📁 Repository Structure

```
├── actions/               # Server Actions (workflows, credentials, billing)
├── app/                   # Next.js App Router
│   ├── (auth)/            # Auth routes (Clerk sign-in/sign-up)
│   ├── (dashboard)/       # Dashboard, Workflows, Credentials, Billing
│   ├── api/               # API endpoints & Webhooks
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI & Workflow components
│   ├── ui/                # shadcn/ui primitives
│   └── workflow/          # Flow canvas, nodes, task forms, logs viewer
├── lib/                   # Utility helpers, database client, workflow engine
│   ├── workflow/          # Execution runner, tasks registry, validation
│   └── prisma.ts          # Singleton Prisma Client
├── prisma/                # Prisma schema & migration files
├── public/                # Static assets & icons
└── types/                 # TypeScript type declarations
```

---

## 🚢 Deployment

ScrapeFlow is ready for deployment across multiple platforms:

- **Docker**: Run via `docker-compose up -d`
- **Vercel**: Deploy with remote browser connection (`BROWSER_WS_ENDPOINT` via Browserless/BrightData).
- **Self-Hosted VPS**: Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for full Nginx + PM2 setup.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).