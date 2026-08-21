import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Code2Icon } from "lucide-react";

export const EvaluateScriptTask = {
  type: TaskType.EVALUATE_SCRIPT,
  label: "Evaluate Script",
  icon: (props) => <Code2Icon className="stroke-emerald-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
      required: true,
    },
    {
      name: "JavaScript Expression",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
      helperText: "JS code to run in page context (e.g., return document.title; or return Array.from(document.querySelectorAll('h2')).map(e => e.innerText))",
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
    },
    {
      name: "Result JSON",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
