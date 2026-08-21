"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";
import NavigationTabs from "./NavigationTabs";
import PublishButton from "./PublishButton";
import UnPublishButton from "./UnPublishButton";
import { TemplateGalleryModal, TemplateDefinition } from "@/components/workflow/TemplateGalleryModal";
import { ExportImportControls } from "@/components/workflow/ExportImportControls";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

function Topbar({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
}: Props) {
  const router = useRouter();
  const { setNodes, setEdges } = useReactFlow();

  const handleSelectTemplate = (template: TemplateDefinition) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    toast.success(`Loaded template: ${template.name}`);
  };

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10 gap-2">
      <div className="flex gap-1 items-center flex-1 min-w-0">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={24} />
          </Button>
        </TooltipWrapper>
        <div className="truncate">
          <p className="font-bold text-ellipsis truncate text-sm sm:text-base">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <NavigationTabs workflowId={workflowId} />

      <div className="flex gap-1.5 items-center flex-1 justify-end flex-wrap">
        {!hideButtons && (
          <Fragment>
            {!isPublished && (
              <Fragment>
                <TemplateGalleryModal onSelectTemplate={handleSelectTemplate} />
                <ExportImportControls workflowName={subtitle || "workflow"} />
              </Fragment>
            )}
            <ExecuteButton workflowId={workflowId} />
            {isPublished && <UnPublishButton workflowId={workflowId} />}
            {!isPublished && (
              <Fragment>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </header>
  );
}

export default Topbar;
