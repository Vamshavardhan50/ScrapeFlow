"use client";

import {
  getWorkflowExecutionWithPhases,
  getWorkflowPhaseDetails,
} from "@/actions/workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { datesToDurationString, getPhasesTotalCost } from "@/lib/helper";
import {
  ExecutionPhaseStatus,
  LogLevel,
  WorkflowExecutionStatus,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExecutionLog } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase, query.data?.status],
    enabled: selectedPhase !== null,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  useEffect(() => {
    // If status is running auto select the running phase
    const phases = query.data?.phases || [];
    if (isRunning) {
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1,
      )[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }
    // Auto selecting last run phase on reload
    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1,
    )[0];
    setSelectedPhase(phaseToSelect?.id || "");
  }, [query.data?.phases, isRunning]);

  const duration = datesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt,
  );

  const creditsConsumed = getPhasesTotalCost(query.data?.phases || []);

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center">
                <PhaseStatusBadge
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span className="">{query.data?.status}</span>
              </div>
            }
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started At"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits Consumed"
            value={<ReactCountUpWrapper value={creditsConsumed} />}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold"> No phase selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={18} className="text-muted-foreground" />
                  <span> Credits</span>
                </div>
                <span> {phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="text-muted-foreground" />
                  <span> Duration </span>
                </div>
                <span>
                  {" "}
                  {datesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt,
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParameterViewer
              title="Inputs"
              subTitle="Inputs used for this phase"
              paramsJson={phaseDetails.data.inputs}
            />

            <ParameterViewer
              title="Outputs"
              subTitle="Outputs generated by this phase"
              paramsJson={phaseDetails.data.outputs}
            />

            <LogViewer
              logs={phaseDetails.data.logs.map((log) => ({
                ...log,
                timestamp: new Date(log.timestamp),
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutionViewer;

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/20" />
        <span>{label}</span>
      </div>
      <div className="font-semibold flex gap-2 items-center capitalize">
        {value}
      </div>
    </div>
  );
}

function ParameterViewer({
  title,
  subTitle,
  paramsJson,
}: {
  title: string;
  subTitle: string;
  paramsJson: string | null;
}) {
  const params = paramsJson ? JSON.parse(paramsJson) : undefined;

  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <div className="text-sm">No parameters generated by this phase</div>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => {
              const isImage =
                typeof value === "string" &&
                (value.startsWith("data:image/") || key.toLowerCase().includes("screenshot"));

              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 space-y-1"
                >
                  <p className="text-sm text-muted-foreground flex-1 basis-1/3 pt-1">
                    {key}
                  </p>
                  {isImage ? (
                    <div className="flex-1 basis-2/3 flex flex-col gap-1">
                      <img
                        src={value}
                        alt={key}
                        className="max-h-[260px] w-auto rounded border object-contain bg-black/5 dark:bg-white/5"
                      />
                      <a
                        href={value}
                        download={`screenshot_${Date.now()}.png`}
                        className="text-xs text-primary underline"
                      >
                        Download Image
                      </a>
                    </div>
                  ) : (
                    <Input
                      readOnly
                      className="flex basis-2/3"
                      value={value as string}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  const [filterLevel, setFilterLevel] = useState<"all" | "info" | "error">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!logs || logs.length === 0) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === "all" || log.logLevel === filterLevel;
    const matchesQuery =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  const handleDownloadLogs = () => {
    const logText = logs
      .map(
        (l) =>
          `[${new Date(l.timestamp).toISOString()}] [${l.logLevel.toUpperCase()}] ${l.message}`
      )
      .join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `execution_phase_logs_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader className="rounded-lg rounded-b-none border-b py-3 bg-gray-50 dark:bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Logs ({filteredLogs.length})</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Logs generated by this phase
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs w-[160px]"
            />
            <div className="flex border rounded-md p-0.5 bg-muted/50 gap-0.5">
              <Button
                variant={filterLevel === "all" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setFilterLevel("all")}
              >
                All
              </Button>
              <Button
                variant={filterLevel === "info" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs text-primary"
                onClick={() => setFilterLevel("info")}
              >
                Info
              </Button>
              <Button
                variant={filterLevel === "error" ? "destructive" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setFilterLevel("error")}
              >
                Error
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleDownloadLogs}
            >
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-xs text-muted-foreground p-[2px] pl-4 font-mono"
                >
                  {new Date(log.timestamp).toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-4",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary",
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-xs flex-1 p-[3px] pl-4 font-mono break-all">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
