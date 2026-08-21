import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { CameraIcon } from "lucide-react";

export const TakeScreenshotTask = {
  type: TaskType.TAKE_SCREENSHOT,
  label: "Take Screenshot",
  icon: (props) => <CameraIcon className="stroke-indigo-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Optional CSS selector to screenshot specific element (leave blank for full page)",
    },
    {
      name: "Full Page",
      type: TaskParamType.SELECT,
      required: false,
      options: [
        { label: "Yes (Scroll & Capture)", value: "true" },
        { label: "No (Viewport Only)", value: "false" },
      ],
      helperText: "Capture full scrollable page or viewport",
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
    },
    {
      name: "Screenshot Base64",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
