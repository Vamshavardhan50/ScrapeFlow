# 🔌 ScrapeFlow API & Webhook Reference

ScrapeFlow provides endpoints for running workflows, background cron triggers, and billing webhooks.

---

## 📡 Endpoints

### 1. Execute Workflow (Trigger Run)
Triggers execution of a published workflow programmatically.

- **Method**: `GET` / `POST`
- **Path**: `/api/workflows/execute`
- **Headers**:
  - `Authorization: Bearer <API_SECRET>`
- **Query / Body Parameters**:
  - `workflowId` (string, required): ID of the workflow to run.
- **Response**:
  ```json
  {
    "success": true,
    "executionId": "clx...",
    "status": "RUNNING"
  }
  ```

---

### 2. Cron Scheduler Endpoint
Endpoint pinged by external cron runners (e.g. Vercel Cron, GitHub Actions) to process due workflows.

- **Method**: `GET`
- **Path**: `/api/workflows/cron`
- **Headers**:
  - `Authorization: Bearer <CRON_SECRET>`
- **Behavior**:
  - Finds all published workflows where `nextRunAt <= now()`.
  - Dispatches execution jobs.
  - Updates `nextRunAt` using the workflow's cron expression.
- **Response**:
  ```json
  {
    "processed": 3,
    "success": true
  }
  ```

---

### 3. Stripe Billing Webhook
Receives Stripe checkout events to credit user accounts.

- **Method**: `POST`
- **Path**: `/api/webhooks/stripe`
- **Headers**:
  - `stripe-signature: <SIGNATURE>`
- **Handled Events**:
  - `checkout.session.completed`: Increments user credit balance and records transaction history.
