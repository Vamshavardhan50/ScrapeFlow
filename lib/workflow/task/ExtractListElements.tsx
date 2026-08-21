import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { ListIcon } from "lucide-react";

export const ExtractListElementsTask = {
  type: TaskType.EXTRACT_LIST_ELEMENTS,
  label: "Extract List Elements",
  icon: (props) => <ListIcon className="stroke-pink-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
      helperText: "CSS selector for repeating items (e.g. .product-card, tr, li)",
    },
    {
      name: "Extract Attributes",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Comma-separated attributes to extract (e.g. href,src,title). Leaves text content by default.",
    },
  ] as const,
  outputs: [
    {
      name: "Extracted List JSON",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
