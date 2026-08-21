"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpenIcon,
  BotIcon,
  CameraIcon,
  Code2Icon,
  DatabaseIcon,
  GlobeIcon,
  KeyIcon,
  LayersIcon,
  MousePointerClickIcon,
  SendIcon,
  SparklesIcon,
  TerminalIcon,
  WorkflowIcon,
  ZapIcon,
} from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-extrabold tracking-tight">Documentation & Guides</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Everything you need to master ScrapeFlow: visual workflow construction, AI extraction, API endpoints, and troubleshooting.
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full max-w-3xl mb-6 bg-muted/60 p-1">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="nodes-reference">Task Nodes</TabsTrigger>
          <TabsTrigger value="ai-recipes">AI Extraction</TabsTrigger>
          <TabsTrigger value="api-webhooks">API & Webhooks</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        {/* TAB 1: Getting Started */}
        <TabsContent value="getting-started" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-max mb-2">
                  <WorkflowIcon size={20} />
                </div>
                <CardTitle className="text-base">1. Build Visually</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Drag task nodes from the left sidebar onto the canvas. Connect output handles to matching input handles to form a Directed Acyclic Graph (DAG).
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-max mb-2">
                  <BotIcon size={20} />
                </div>
                <CardTitle className="text-base">2. Parse with AI or Selectors</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Use traditional CSS selectors via Cheerio or feed raw HTML into GPT-4 to extract structured JSON without maintaining fragile selectors.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-max mb-2">
                  <SendIcon size={20} />
                </div>
                <CardTitle className="text-base">3. Deliver & Schedule</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Deliver parsed JSON data via HTTP POST webhooks to your server, CRM, or data lake. Automate execution using cron schedules.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ZapIcon size={18} className="text-primary" />
                Credit Consumption & Rate Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                Workflows consume credits strictly based on task node execution. Lightweight nodes (like JSON manipulations or Cheerio text extraction) cost 1 credit, while heavy browser automation or AI generation nodes consume 2–3 credits.
              </p>
              <div className="p-4 rounded-lg bg-muted/40 border text-xs font-mono">
                <span className="text-foreground font-bold">Execution Plan Cost Formula:</span>
                <br />
                Total Cost = SUM(TaskRegistry[node.type].credits) across all planned nodes.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Task Nodes Reference */}
        <TabsContent value="nodes-reference" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="text-pink-400" size={18} />
                    <CardTitle className="text-base">Launch Browser</CardTitle>
                  </div>
                  <Badge variant="outline">Entry Point • 5 Credits</Badge>
                </div>
                <CardDescription className="text-xs mt-2">
                  Initiates a headless Chromium instance (locally or via Bright Data WebSocket endpoint) and navigates to the target URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground pt-0">
                <p><b>Inputs:</b> Website URL (required)</p>
                <p><b>Outputs:</b> Web page (BrowserInstance handle)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BotIcon className="text-rose-400" size={18} />
                    <CardTitle className="text-base">Extract Data via AI</CardTitle>
                  </div>
                  <Badge variant="outline">AI • 3 Credits</Badge>
                </div>
                <CardDescription className="text-xs mt-2">
                  Sends HTML/text content to OpenAI with a natural language prompt and extracts cleanly structured JSON conforming to your prompt.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground pt-0">
                <p><b>Inputs:</b> Content (HTML/text), Prompt, Credentials (OpenAI Key)</p>
                <p><b>Outputs:</b> Extracted Data (JSON string)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CameraIcon className="text-indigo-400" size={18} />
                    <CardTitle className="text-base">Take Screenshot</CardTitle>
                  </div>
                  <Badge variant="outline">Interaction • 2 Credits</Badge>
                </div>
                <CardDescription className="text-xs mt-2">
                  Captures a full-page or selector-specific PNG snapshot. Displays live image previews in the execution logs viewer.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground pt-0">
                <p><b>Inputs:</b> Web page, Selector (optional), Full Page (Yes/No)</p>
                <p><b>Outputs:</b> Web page, Screenshot Base64</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SendIcon className="text-blue-400" size={18} />
                    <CardTitle className="text-base">Deliver via Webhook</CardTitle>
                  </div>
                  <Badge variant="outline">Delivery • 1 Credit</Badge>
                </div>
                <CardDescription className="text-xs mt-2">
                  Dispatches JSON output to external HTTP endpoints via POST with automated retry logic on transient network or 5xx server errors.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground pt-0">
                <p><b>Inputs:</b> Target URL (required), Body (JSON string)</p>
                <p><b>Outputs:</b> Delivery status & response payload</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: AI Recipes */}
        <TabsContent value="ai-recipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SparklesIcon className="text-primary" size={20} />
                Crafting High-Accuracy AI Extraction Prompts
              </CardTitle>
              <CardDescription>
                Follow these prompt patterns to extract perfect JSON arrays without hallucination or truncation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border bg-muted/30">
                <p className="font-bold text-sm text-foreground mb-1">E-Commerce Product Catalog Recipe:</p>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  "Extract all products in this HTML into a JSON array of objects with keys: title (string), price (number), rating (number or null), inStock (boolean), and imageUrl (string)."
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-muted/30">
                <p className="font-bold text-sm text-foreground mb-1">Job Board & Career Portal Recipe:</p>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  "Extract all job openings into a JSON array of objects containing: roleTitle, company, location, salaryRange, and applicationLink."
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: API & Webhooks */}
        <TabsContent value="api-webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TerminalIcon className="text-primary" size={20} />
                REST API Trigger Endpoint
              </CardTitle>
              <CardDescription>
                Trigger published workflows programmatically from your backend services or CI/CD pipelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black/60 rounded-lg text-emerald-400 border">
                POST /api/workflows/execute?workflowId=&#123;WORKFLOW_ID&#125;
                <br />
                Authorization: Bearer &lt;YOUR_API_SECRET&gt;
              </div>
              <p className="text-muted-foreground text-xs font-sans">
                Returns a 200 OK response with the execution record ID and initiates asynchronous processing.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: Troubleshooting */}
        <TabsContent value="troubleshooting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="font-bold text-foreground text-sm">Navigation Timeout (30000ms exceeded)</p>
                <p className="text-muted-foreground mt-0.5">
                  Target webpage is taking too long to reach network idle. You can increase <code>PUPPETEER_TIMEOUT</code> in environment variables or connect a remote Bright Data proxy endpoint via <code>BROWSER_WS_ENDPOINT</code>.
                </p>
              </div>

              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="font-bold text-foreground text-sm">Element not found for selector</p>
                <p className="text-muted-foreground mt-0.5">
                  Add a <code>Wait for Element</code> task node immediately before clicking or extracting text to allow dynamic single-page applications to finish DOM hydration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
