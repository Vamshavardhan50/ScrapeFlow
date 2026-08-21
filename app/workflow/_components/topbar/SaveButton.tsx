"use client";

import { updateWorkFlow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: async (data: { id: string; definition: string }) => {
      return await updateWorkFlow({ id: data.id, definition: data.definition });
    },
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message, { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDef = JSON.stringify(toObject());
        toast.loading("Saving Workflow", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDef,
        });
      }}
      disabled={saveMutation.isPending}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}

export default SaveButton;
