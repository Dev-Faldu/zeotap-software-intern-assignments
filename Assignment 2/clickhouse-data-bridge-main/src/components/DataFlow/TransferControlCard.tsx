
import React from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/UI/DashboardCard";
import TransferStatus from "@/components/DataFlow/TransferStatus";
import { Column, TransferStats } from "@/types";

interface TransferControlCardProps {
  selectedColumns: Column[];
  selectedTable: string | null;
  direction: string;
  transferStats: TransferStats;
  isTransferring: boolean;
  onStartTransfer: () => void;
}

const TransferControlCard = ({
  selectedColumns,
  selectedTable,
  direction,
  transferStats,
  isTransferring,
  onStartTransfer,
}: TransferControlCardProps) => {
  return (
    <DashboardCard 
      title="Transfer Control" 
      description="Start and monitor data transfer"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              {direction === "import" ? "Import to" : "Export from"}:{" "}
              {selectedTable || "Selected Table"}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedColumns.length} columns selected
            </p>
          </div>
          <Button 
            onClick={onStartTransfer}
            disabled={isTransferring || transferStats.status === "running"}
            size="lg"
          >
            {isTransferring 
              ? "Transferring..." 
              : `Start ${direction === "import" ? "Import" : "Export"}`}
          </Button>
        </div>
        
        <TransferStatus stats={{
          ...transferStats,
          status: transferStats.status === "error" ? "failed" : transferStats.status,
        }} />
      </div>
    </DashboardCard>
  );
};

export default TransferControlCard;
