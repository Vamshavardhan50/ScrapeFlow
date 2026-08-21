"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BotIcon,
  CameraIcon,
  CoinsIcon,
  GlobeIcon,
  LayersIcon,
  LayoutTemplateIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StoreIcon,
  WorkflowIcon,
} from "lucide-react";
import { WORKFLOW_TEMPLATES, TemplateDefinition } from "@/components/workflow/TemplateGalleryModal";
import { createWorkflowFromTemplate } from "@/actions/workflows";
import { toast } from "sonner";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isPending, startTransition] = useTransition();

  const categories = ["All", "AI & News", "E-Commerce", "Monitoring"];

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: TemplateDefinition) => {
    startTransition(async () => {
      try {
        toast.loading(`Creating "${template.name}" workflow...`, { id: "template-clone" });
        const definition = JSON.stringify({
          nodes: template.nodes,
          edges: template.edges,
        });
        await createWorkflowFromTemplate({
          name: `${template.name} (Clone)`,
          description: template.description,
          definition,
        });
        toast.success("Workflow created successfully!", { id: "template-clone" });
      } catch (err: any) {
        toast.error("Failed to clone template: " + err.message, { id: "template-clone" });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <StoreIcon className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-extrabold tracking-tight">Template Marketplace</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Discover and clone verified scraping pipelines, AI parsers, and browser automation blueprints.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-[260px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className="hover:border-primary/50 transition duration-200 flex flex-col justify-between shadow-sm hover:shadow-md bg-card/60 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon size={24} />
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{template.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-3 leading-relaxed">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <LayersIcon size={14} />
                    {template.nodes.length} Task Nodes
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <CoinsIcon size={14} className="text-primary" />
                    Estimated ~4 Credits
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className="w-full gap-2 font-medium"
                  disabled={isPending}
                  onClick={() => handleUseTemplate(template)}
                >
                  <PlusIcon size={16} />
                  Clone & Open Editor
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl p-8">
          <StoreIcon size={40} className="text-muted-foreground opacity-40" />
          <p className="font-bold text-lg">No templates found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      )}
    </div>
  );
}
