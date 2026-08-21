# 📐 ScrapeFlow — Complete Mermaid Architecture & System Diagrams

This document provides complete, visual Mermaid diagrams detailing every layer of ScrapeFlow: high-level architecture, execution lifecycle, database schema (ERD), sequence diagrams, and security workflows.

---

## 1. 🌐 High-Level System Architecture

```mermaid
graph TB
    subgraph ClientLayer["🖥️ Client Layer (Next.js 14 App Router)"]
        UI[Landing Page & Dashboard]
        Canvas["React Flow Workflow Canvas<br/>(@xyflow/react)"]
        RunViewer[Execution Viewer & Logs]
        BillingUI[Stripe Billing & Invoices]
    end

    subgraph AuthLayer["🔐 Auth & Security Layer"]
        Clerk[Clerk Authentication]
        AES[AES-256 Symmetric Credential Encryption]
    end

    subgraph ServerLayer["⚙️ Server Engine & APIs (Next.js Server Actions & API Routes)"]
        Planner["Execution Planner & Topological Sorter<br/>(executionPlan.ts)"]
        Runner["Workflow Execution Runtime<br/>(executeWorkflow.ts)"]
        CronAPI["Cron Scheduler API<br/>(/api/workflows/cron)"]
        ExecAPI["Direct Trigger API<br/>(/api/workflows/execute)"]
        StripeWebhook["Stripe Webhook Handler<br/>(/api/webhooks/stripe)"]
    end

    subgraph ExecutionLayer["🤖 Scraping & Processing Engine"]
        Puppeteer["Puppeteer Headless Chromium Engine<br/>(Local / Bright Data Remote WS)"]
        Cheerio["Cheerio DOM Parser"]
        OpenAI["OpenAI GPT-4o-mini Semantic Parser"]
        WebhookClient["HTTP Webhook Dispatcher"]
    end

    subgraph StorageLayer["💾 Database & Persistence (Prisma ORM)"]
        DB[("Database<br/>SQLite / PostgreSQL")]
    end

    %% Interactions
    UI --> Clerk
    Canvas --> Planner
    Planner --> Runner
    CronAPI --> Runner
    ExecAPI --> Runner
    Runner --> AES
    Runner --> Puppeteer
    Runner --> Cheerio
    Runner --> OpenAI
    Runner --> WebhookClient
    Runner --> DB
    BillingUI --> StripeWebhook
    StripeWebhook --> DB
    RunViewer --> DB
```

---

## 2. 🔄 Workflow Execution Lifecycle (Flowchart)

```mermaid
flowchart TD
    Start([User Clicks Run / Cron Trigger]) --> LoadFlow[Fetch Workflow Definition & Execution Plan]
    LoadFlow --> CheckPlan{Is Execution Plan Valid?}
    
    CheckPlan -- No --> FailPlan[Mark Status: FAILED<br/>Log: Invalid Execution Plan] --> End([Execution Ended])
    CheckPlan -- Yes --> CreateExec[Create WorkflowExecution in DB<br/>Status: RUNNING]
    
    CreateExec --> InitEnv[Initialize In-Memory Execution Context<br/>browser, page, phases, logs]
    InitEnv --> LoopPhases[Iterate Through Topological Phases 1..N]
    
    LoopPhases --> CheckCredits{Check & Decrement<br/>User Credits}
    CheckCredits -- Insufficient --> PhaseFail[Log: Insufficient Balance<br/>Mark Phase: FAILED] --> StopExec[Stop Execution]
    
    CheckCredits -- Success --> ExecNode[Execute Task via ExecutorRegistry]
    
    subgraph Tasks["Task Execution Modules"]
        ExecNode --> T1["LAUNCH_BROWSER / NAVIGATE_URL"]
        ExecNode --> T2["CLICK / FILL / SCROLL / WAIT"]
        ExecNode --> T3["PAGE_TO_HTML / EXTRACT_TEXT"]
        ExecNode --> T4["EXTRACT_DATA_WITH_AI (OpenAI)"]
        ExecNode --> T5["DELIVER_VIA_WEBHOOK"]
    end
    
    Tasks --> CollectLogs[Collect Timestamped Logs & Phase Outputs]
    CollectLogs --> UpdatePhaseDB[Save Phase Outputs & Logs to DB]
    
    UpdatePhaseDB --> HasMorePhases{More Phases &<br/>Current Phase Succeeded?}
    HasMorePhases -- Yes --> LoopPhases
    HasMorePhases -- No / Failed --> Cleanup[Close Puppeteer Browser & Release Handles]
    
    Cleanup --> FinalizeDB[Update WorkflowExecution & Workflow LastRun Status<br/>COMPLETED / FAILED]
    StopExec --> Cleanup
    FinalizeDB --> End
```

---

## 3. 📊 Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    Workflow ||--o{ WorkflowExecution : "has executions"
    WorkflowExecution ||--o{ ExecutionPhase : "contains phases"
    ExecutionPhase ||--o{ ExecutionLog : "generates logs"
    
    Workflow {
        string id PK "UUID"
        string userId "Clerk User ID"
        string name "Unique per user"
        string description "Nullable"
        string definition "JSON String (Nodes & Edges)"
        string executionPlan "JSON String (Ordered Phases)"
        int creditsCost "Computed total credits"
        string status "DRAFT | PUBLISHED"
        string cron "Cron expression (Nullable)"
        datetime nextRunAt "Next scheduled run"
        datetime lastRunAt "Last execution timestamp"
        string lastRunId "Last execution ID"
        string lastRunStatus "COMPLETED | FAILED | RUNNING"
        datetime createdAt
        datetime updatedAt
    }

    WorkflowExecution {
        string id PK "CUID"
        string workflowId FK "References Workflow.id"
        string userId "Clerk User ID"
        string trigger "MANUAL | CRON"
        string status "PENDING | RUNNING | COMPLETED | FAILED"
        int creditsConsumed "Total credits used"
        string definition "Snapshot of flow definition"
        datetime startedAt
        datetime completedAt
        datetime createdAt
    }

    ExecutionPhase {
        string id PK "CUID"
        string workflowExecutionId FK "References WorkflowExecution.id"
        string userId "Clerk User ID"
        string status "PENDING | RUNNING | COMPLETED | FAILED"
        int number "Phase order index"
        string node "JSON Node definition"
        string name "Task display name"
        string inputs "JSON string of input parameters"
        string outputs "JSON string of output values"
        int creditsConsumed "Credits for this node"
        datetime startedAt
        datetime completedAt
    }

    ExecutionLog {
        string id PK "CUID"
        string executionPhaseId FK "References ExecutionPhase.id"
        string logLevel "INFO | WARNING | ERROR"
        string message "Log description text"
        datetime timestamp "Log event timestamp"
    }

    UserBalance {
        string userId PK "Clerk User ID"
        int credits "Current available balance"
    }

    Credential {
        string id PK "CUID"
        string userId "Clerk User ID"
        string name "Unique per user"
        string value "AES-256 Encrypted ciphertext"
        datetime createdAt
    }

    UserPurchase {
        string id PK "CUID"
        string userId "Clerk User ID"
        string stripeId "Stripe Payment Intent / Checkout ID"
        string description "Package name"
        int amount "Price in cents"
        string currency "USD, etc."
        datetime date
    }
```

---

## 4. ⏱️ Sequence Diagram: Workflow Execution & Telemetry

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant UI as React Flow Editor
    participant Action as runWorkflow() Action
    participant Planner as executionPlan.ts
    participant Runner as executeWorkflow.ts
    participant DB as Prisma Database
    participant Puppeteer as Chromium / Bright Data WS
    participant OpenAI as OpenAI API
    participant Webhook as Downstream Webhook API

    User->>UI: Clicks "Run Workflow"
    UI->>Action: Invoke Server Action with Flow Definition
    Action->>Planner: flowToExecutionPlan(nodes, edges)
    Planner-->>Action: Returns Ordered ExecutionPlan
    Action->>DB: Create WorkflowExecution & ExecutionPhases (PENDING)
    Action->>Runner: executeWorkflow(executionId)
    Action-->>UI: Return Execution ID (Redirect to Run Viewer)

    loop For each Phase in ExecutionPlan
        Runner->>DB: Check & Decrement Credits from UserBalance
        Runner->>DB: Update Phase Status to RUNNING
        alt Browser / Navigation Node
            Runner->>Puppeteer: Launch Browser / Navigate to URL
            Puppeteer-->>Runner: Return Page Handle & HTML
        else AI Extraction Node
            Runner->>DB: Decrypt User's OpenAI Credential (AES-256)
            Runner->>OpenAI: Request Chat Completion (gpt-4o-mini with HTML + Prompt)
            OpenAI-->>Runner: Return Structured JSON Payload
        else Webhook Delivery Node
            Runner->>Webhook: HTTP POST with Extracted JSON Data (Retries on 5xx)
            Webhook-->>Runner: 200 OK Response
        end
        Runner->>DB: Persist Phase Outputs & ExecutionLogs
        Runner->>DB: Update Phase Status (COMPLETED)
    end

    Runner->>Puppeteer: Close Browser Instance
    Runner->>DB: Update WorkflowExecution Status (COMPLETED)
    UI->>DB: Poll ExecutionViewer (React Query)
    DB-->>UI: Render Real-Time Logs, Durations & Phase Badges
```

---

## 5. 🔐 Security & Encrypted Credential Vault

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant CredentialUI as Credentials Page
    participant Server as Server Action (lib/credential.ts)
    participant DB as Prisma Credential Table
    participant Node as AI / Auth Node Executor

    Note over User,Server: Storing a New Credential
    User->>CredentialUI: Enters API Key (e.g. OpenAI Key)
    CredentialUI->>Server: createCredential({ name, value })
    Server->>Server: Encrypt via AES-256-CBC (Using ENCRYPTION_SECRET)
    Server->>DB: Save ciphertext & IV (Plaintext never stored)

    Note over Node,DB: Using Credential in Workflow
    Node->>DB: Fetch Credential by ID
    DB-->>Node: Return encrypted ciphertext
    Node->>Server: symmetricDecrypt(ciphertext)
    Server-->>Node: Return plaintext key directly in memory
    Node->>Node: Use key for API request & drop from memory
```
