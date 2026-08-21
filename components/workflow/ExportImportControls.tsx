"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

interface ExportImportControlsProps {
  workflowName: string;
}

export function ExportImportControls({ workflowName }: ExportImportControlsProps) {
  const { toObject, setNodes, setEdges } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const flow = toObject();
      const jsonString = JSON.stringify(flow, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workflowName.toLowerCase().replace(/\s+/g, "_")}_flow.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Workflow exported successfully!");
    } catch (err: any) {
      toast.error("Failed to export workflow: " + err.message);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedFlow = JSON.parse(content);

        if (!parsedFlow.nodes || !Array.isArray(parsedFlow.nodes)) {
          throw new Error("Invalid workflow file format. Missing nodes array.");
        }

        setNodes(parsedFlow.nodes || []);
        setEdges(parsedFlow.edges || []);
        toast.success("Workflow imported successfully!");
      } catch (err: any) {
        toast.error("Import failed: " + err.message);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="flex items-center gap-1 text-xs"
        title="Export Workflow JSON"
      >
        <DownloadIcon size={14} />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        className="flex items-center gap-1 text-xs"
        title="Import Workflow JSON"
      >
        <UploadIcon size={14} />
        Import
      </Button>
    </div>
  );
}
