# 🌟 ScrapeFlow Features & Capabilities

ScrapeFlow is an advanced, production-ready visual web scraping, browser automation, and AI extraction engine designed to eliminate the fragility of traditional scraping scripts.

---

## 📑 Feature Breakdown

### 1. 🎨 Visual Drag-and-Drop Workflow Canvas
- **React Flow Engine**: Highly responsive, interactive canvas for creating arbitrary directed acyclic graphs (DAGs) of scraping pipelines.
- **Dynamic Task Ports**: Strongly typed inputs and outputs (`BrowserInstance`, `String`, `ElementHandle`, `JSON`, `Credentials`) preventing invalid wire connections.
- **Live Validation**: Visual warnings and validation badges indicating missing required parameters or disconnected nodes before execution.
- **Node Duplication & Layout Controls**: Multi-node zooming, panning, minimap navigation, and one-click duplication.

---

### 2. ⚡ Headless Browser Automation (Puppeteer Engine)
- **Chromium Orchestration**: Headless and headful execution modes with configurable viewport dimensions and user-agent emulation.
- **Dynamic Navigation & SPA Support**: Handles complex single-page apps (React, Vue, Angular) with custom navigation timeout settings and `networkidle2` wait triggers.
- **Simulated Human Interaction**:
  - `Click Element`: Accurate mouse clicks on buttons, links, dropdowns, and checkboxes.
  - `Fill Input`: Realistic keystrokes and typing delay simulation to bypass basic bot traps.
  - `Scroll to Element`: Smooth scrolling to trigger infinite scrolling feeds or lazy-loaded assets.
  - `Wait for Element`: Adaptive visibility guards waiting for selector presence or detachment.

---

### 3. 🤖 AI-Powered Intelligent Data Extraction
- **GPT-4 / OpenAI Integration**: Ingests raw HTML or target containers and extracts clean, structured JSON conforming to user-defined prompt instructions.
- **Self-Healing Selectors**: Bypasses unstable CSS selectors and obfuscated class names (Tailwind random classes, styled-components hashes) by using contextual semantic understanding.
- **Multi-entity Extraction**: Extracts tables, pricing grids, customer reviews, and metadata into clean arrays with zero regex overhead.

---

### 4. ⏱️ Automated Scheduling & Cron Triggers
- **Cron Expression Engine**: Visual schedule picker with standard 5-part cron syntax (e.g., `0 */6 * * *` for every 6 hours).
- **Time Zone Awareness**: Displays next execution in both local time and UTC formats.
- **Headless Background Execution**: Next.js API cron endpoint triggered by external schedulers (Vercel Cron, GitHub Actions, Upstash QStash).

---

### 5. 🔐 Secure Credential & API Token Vault
- **AES-256 Symmetric Encryption**: Sensitive credentials (passwords, proxy tokens, OpenAI API keys, auth headers) are encrypted at rest using server-side master keys.
- **Drop-down Credential Injection**: Inject stored credentials directly into workflow nodes via secure parameter selectors without exposing plaintext keys in canvas definitions.

---

### 6. 📡 Webhook Dispatch & Data Export
- **HTTP POST Webhook Delivery**: Stream structured scraping output straight to client endpoints, Zapier, Make, n8n, or internal ingestion servers.
- **Automatic Retry System**: Handles transient HTTP errors (5xx, timeouts) with configurable backoff policies.
- **Execution Payload Previews**: Inspect raw payloads sent to webhooks inside the run viewer.

---

### 7. 📊 Execution Telemetry & Historical Audits
- **Per-Node Phase Logs**: Real-time phase execution logs with millisecond timestamps, log levels (`INFO`, `WARNING`, `ERROR`), and elapsed durations.
- **Execution Viewer**: Step-by-step visual playback and execution tree displaying input/output data for each individual node.
- **Historical Run Table**: Filterable history of all past runs with duration metrics, trigger origins, and consumption costs.

---

### 8. 💳 Usage Analytics, Credits & Billing
- **Node-Based Credit Calculation**: Granular credit pricing based on task resource intensity (e.g., browser launch costs vs. simple JSON transformations).
- **Stripe Checkout Integration**: Seamless credit package purchases and instant webhook-driven balance replenishment.
- **Monthly Usage Analytics**: Interactive charts showing daily credit consumption and execution success rates.
- **Invoice Downloads**: Downloadable PDF receipts for every credit purchase.
