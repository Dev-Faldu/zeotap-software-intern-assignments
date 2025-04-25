
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export interface TransferStats {
  status: "idle" | "running" | "completed" | "failed";
  recordsTotal?: number;
  recordsProcessed?: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
  logs: string[];
}

interface TransferStatusProps {
  stats: TransferStats;
}

const TransferStatus = ({ stats }: TransferStatusProps) => {
  const progressPercentage =
    stats.recordsTotal && stats.recordsProcessed
      ? Math.round((stats.recordsProcessed / stats.recordsTotal) * 100)
      : 0;
  
  const duration = stats.startTime && stats.endTime 
    ? ((stats.endTime.getTime() - stats.startTime.getTime()) / 1000).toFixed(2)
    : null;
  
  const recordsPerSecond = 
    stats.recordsProcessed && duration 
      ? Math.round(stats.recordsProcessed / parseFloat(duration))
      : null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Transfer Status</h3>
          <StatusBadge status={stats.status} />
        </div>
        {stats.status === "running" && (
          <>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Processed {stats.recordsProcessed?.toLocaleString() || 0} of{" "}
              {stats.recordsTotal?.toLocaleString() || "?"} records (
              {progressPercentage}%)
            </p>
          </>
        )}
      </div>

      {stats.status === "completed" && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Transfer Completed Successfully</AlertTitle>
          <AlertDescription>
            Processed {stats.recordsProcessed?.toLocaleString()} records in {duration}s
            {recordsPerSecond && ` (${recordsPerSecond.toLocaleString()} records/sec)`}
          </AlertDescription>
        </Alert>
      )}

      {stats.status === "failed" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Transfer Failed</AlertTitle>
          <AlertDescription>{stats.errorMessage}</AlertDescription>
        </Alert>
      )}

      {stats.logs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Transfer Log</h4>
          <ScrollArea className="h-40 border rounded-md p-3 bg-muted/30">
            {stats.logs.map((log, index) => (
              <div 
                key={index} 
                className="py-1 text-sm font-mono border-b last:border-b-0 border-muted"
              >
                {log}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: TransferStats["status"] }) => {
  switch (status) {
    case "idle":
      return <span className="px-2 py-1 text-xs bg-muted rounded-md">Ready</span>;
    case "running":
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">Running</span>;
    case "completed":
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">Completed</span>;
    case "failed":
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md">Failed</span>;
  }
};

export default TransferStatus;
