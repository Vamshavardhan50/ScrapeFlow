# 📐 ScrapeFlow Architecture & Technical Design

This document details the architectural layout, state management, execution pipeline, and database schema for ScrapeFlow.

---

## 🏛️ High-Level Architectural Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  Next.js 14 App Router, React Flow Canvas, shadcn/ui        │
└──────────────┬──────────────────────────────▲───────────────┘
               │ Server Actions / API Calls   │ SSE / Polling
┌──────────────▼──────────────────────────────┴───────────────┐
│                      Server Layer                           │
│  Workflow Engine, Execution Planner, Topological Sorter     │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
     ┌─────────┴─────────┐          ┌─────────┴─────────┐
     │  Puppeteer / DOM  │          │   Prisma ORM &    │
     │  Execution Engine │          │   SQLite / PG     │
     └─────────┬─────────┘          └───────────────────┘
               │
     ┌─────────▼─────────┐
     │  OpenAI GPT-4 &   │
     │  Webhook Services │
     └───────────────────┘
```

---

## ⚙️ Core Subsystems

### 1. Workflow Topological Planner (`lib/workflow/executionPlan.ts`)
- The canvas graph is composed of `AppNode` nodes and `Edge` connections.
- The planner validates that:
  - There is a valid entry point (e.g. `LAUNCH_BROWSER`).
  - No cyclical loops exist.
  - All required node parameters and input handles have upstream connections or defaults.
- Converts the canvas graph into sequential execution phases (`ExecutionPhase`), grouping nodes that can run deterministically.

### 2. Execution Runtime (`lib/workflow/executeWorkflow.ts`)
- Initializes an `Environment` containing `browser`, `page`, `phases`, and variable references.
- Runs each node's dedicated executor from `lib/workflow/executor/Registry.ts`:
  - `LaunchBrowserExecutor`: Spawns or connects to headless Chromium.
  - `NavigateUrlExecutor`: Directs page to URL and waits for DOM readiness.
  - `ClickElementExecutor` / `FillInputExecutor`: Simulates user action via selector queries.
  - `ExtractDataWithAiExecutor`: Passes HTML context to OpenAI and formats JSON response.
  - `DeliverViaWebHookExecutor`: Sends payload via HTTP POST.

### 3. Database Schema (`prisma/schema.prisma`)
- **`Workflow`**: Stores canvas definition (`JSON`), status (`DRAFT`, `PUBLISHED`), cron schedules, and credit cost.
- **`WorkflowExecution`**: Represents a single execution run with duration, trigger type, and total credits consumed.
- **`ExecutionPhase`**: Per-node telemetry tracking started/completed timestamps, inputs, outputs, and credits.
- **`ExecutionLog`**: Granular log entries emitted during phase execution (`INFO`, `WARNING`, `ERROR`).
- **`Credential`**: AES-encrypted user credentials.
- **`UserBalance` & `UserPurchase`**: Credit balance and Stripe invoice transaction records.

---

## 🔒 Security Architecture

1. **Authentication**: Handled via Clerk session middleware with protected server action boundaries.
2. **Encryption**: AES-256 symmetric cipher via `crypto` module (`lib/credential.ts`). Plaintext values never touch the database or client canvas definitions.
3. **Execution Sandbox**: Puppeteer runs isolated browser instances per execution run, preventing cross-user data leakage.
