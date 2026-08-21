"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BotIcon, LayoutTemplateIcon, ShoppingCartIcon, SparklesIcon, FileTextIcon, CameraIcon, LucideProps } from "lucide-react";
import { TaskType, AppNode } from "@/lib/types";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import { Edge } from "@xyflow/react";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: "E-Commerce" | "AI & News" | "Monitoring" | "Forms & Auth";
  icon: React.ComponentType<LucideProps>;
  nodes: AppNode[];
  edges: Edge[];
}

export const WORKFLOW_TEMPLATES: TemplateDefinition[] = [
  {
    id: "ai-news-extractor",
    name: "AI News & Article Extractor",
    description: "Navigates to an article URL, grabs raw HTML, and uses GPT to extract headline, author, and structured bullet summaries.",
    category: "AI & News",
    icon: SparklesIcon,
    nodes: [
      {
        ...createFlowNode(TaskType.LAUNCH_BROWSER, { x: 50, y: 100 }),
        id: "node_launch",
      },
      {
        ...createFlowNode(TaskType.PAGE_TO_HTML, { x: 450, y: 100 }),
        id: "node_html",
      },
      {
        ...createFlowNode(TaskType.EXTRACT_DATA_WITH_AI, { x: 850, y: 100 }),
        id: "node_ai",
      },
      {
        ...createFlowNode(TaskType.DELIVER_VIA_WEBHOOK, { x: 1250, y: 100 }),
        id: "node_webhook",
      },
    ],
    edges: [
      {
        id: "e1",
        source: "node_launch",
        sourceHandle: "Web page",
        target: "node_html",
        targetHandle: "Web page",
      },
      {
        id: "e2",
        source: "node_html",
        sourceHandle: "HTML",
        target: "node_ai",
        targetHandle: "Content",
      },
      {
        id: "e3",
        source: "node_ai",
        sourceHandle: "Extracted Data",
        target: "node_webhook",
        targetHandle: "Body",
      },
    ],
  },
  {
    id: "ecommerce-price-tracker",
    name: "E-Commerce Price & Title Scraper",
    description: "Loads an e-commerce product page, scrolls to details, extracts price and title selectors, and dispatches via webhook.",
    category: "E-Commerce",
    icon: ShoppingCartIcon,
    nodes: [
      {
        ...createFlowNode(TaskType.LAUNCH_BROWSER, { x: 50, y: 100 }),
        id: "node_launch",
      },
      {
        ...createFlowNode(TaskType.PAGE_TO_HTML, { x: 450, y: 100 }),
        id: "node_html",
      },
      {
        ...createFlowNode(TaskType.EXTRACT_TEXT_FROM_ELEMENT, { x: 850, y: 50 }),
        id: "node_title",
      },
      {
        ...createFlowNode(TaskType.EXTRACT_TEXT_FROM_ELEMENT, { x: 850, y: 350 }),
        id: "node_price",
      },
      {
        ...createFlowNode(TaskType.DELIVER_VIA_WEBHOOK, { x: 1250, y: 150 }),
        id: "node_webhook",
      },
    ],
    edges: [
      {
        id: "e1",
        source: "node_launch",
        sourceHandle: "Web page",
        target: "node_html",
        targetHandle: "Web page",
      },
      {
        id: "e2",
        source: "node_html",
        sourceHandle: "HTML",
        target: "node_title",
        targetHandle: "Html",
      },
      {
        id: "e3",
        source: "node_html",
        sourceHandle: "HTML",
        target: "node_price",
        targetHandle: "Html",
      },
      {
        id: "e4",
        source: "node_title",
        sourceHandle: "Extracted Text",
        target: "node_webhook",
        targetHandle: "Body",
      },
    ],
  },
  {
    id: "visual-snapshot-check",
    name: "Visual Screenshot & Health Check",
    description: "Opens target URL, waits for main container element to load, and captures a full-page PNG screenshot.",
    category: "Monitoring",
    icon: CameraIcon,
    nodes: [
      {
        ...createFlowNode(TaskType.LAUNCH_BROWSER, { x: 50, y: 100 }),
        id: "node_launch",
      },
      {
        ...createFlowNode(TaskType.WAIT_FOR_ELEMENT, { x: 450, y: 100 }),
        id: "node_wait",
      },
      {
        ...createFlowNode(TaskType.TAKE_SCREENSHOT, { x: 850, y: 100 }),
        id: "node_screenshot",
      },
      {
        ...createFlowNode(TaskType.DELIVER_VIA_WEBHOOK, { x: 1250, y: 100 }),
        id: "node_webhook",
      },
    ],
    edges: [
      {
        id: "e1",
        source: "node_launch",
        sourceHandle: "Web page",
        target: "node_wait",
        targetHandle: "Web page",
      },
      {
        id: "e2",
        source: "node_wait",
        sourceHandle: "Web page",
        target: "node_screenshot",
        targetHandle: "Web page",
      },
      {
        id: "e3",
        source: "node_screenshot",
        sourceHandle: "Screenshot Base64",
        target: "node_webhook",
        targetHandle: "Body",
      },
    ],
  },
];

interface TemplateGalleryModalProps {
  onSelectTemplate: (template: TemplateDefinition) => void;
}

export function TemplateGalleryModal({ onSelectTemplate }: TemplateGalleryModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <LayoutTemplateIcon size={16} />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <LayoutTemplateIcon className="text-primary" size={22} />
            Workflow Templates
          </DialogTitle>
          <DialogDescription>
            Choose a ready-to-run template to jumpstart your scraping pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {WORKFLOW_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <Card
                key={tmpl.id}
                className="hover:border-primary/50 transition cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  onSelectTemplate(tmpl);
                  setOpen(false);
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <Badge variant="secondary">{tmpl.category}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{tmpl.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {tmpl.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="secondary" size="sm" className="w-full mt-2">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
