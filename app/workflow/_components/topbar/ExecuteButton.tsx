"use client";
import { runWorkflow } from "@/actions/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generateExecutionPlan = useExecutionPlan();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: { workflowId: string; flowDefinition: string }) => {
      return await runWorkflow({
        workflowId: data.workflowId,
        flowDefinition: data.flowDefinition,
      });
    },
    onSuccess: (data) => {
      toast.success("Execution Started", { id: "flow-execution" });
      router.push(data.redirectUrl);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message, { id: "flow-execution" });
    },
  });

  const { toObject } = useReactFlow();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generateExecutionPlan();
        if (!plan) return;
        toast.success("Starting execution...", { id: "flow-execution" });
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" /> Execute
    </Button>
  );
}

export default ExecuteButton;
