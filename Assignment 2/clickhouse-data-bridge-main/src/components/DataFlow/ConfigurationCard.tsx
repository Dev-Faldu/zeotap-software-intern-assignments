
import React from "react";
import DashboardCard from "@/components/UI/DashboardCard";
import SourceSelector from "@/components/DataFlow/SourceSelector";
import { Direction, SourceType } from "@/components/DataFlow/SourceSelector";

interface ConfigurationCardProps {
  selectedSource: SourceType;
  selectedDirection: Direction;
  onSourceSelect: (source: SourceType) => void;
  onDirectionSelect: (direction: Direction) => void;
  tables: { name: string }[];
  selectedTable: string | null;
  onTableSelect: (table: string | null) => void;
  isConnected: boolean;
  direction: Direction;
  sourceType: SourceType;
}

const ConfigurationCard = ({
  selectedSource,
  selectedDirection,
  onSourceSelect,
  onDirectionSelect,
  tables,
  selectedTable,
  onTableSelect,
  isConnected,
  direction,
  sourceType,
}: ConfigurationCardProps) => {
  return (
    <DashboardCard 
      title="Data Flow Configuration" 
      description="Select source, target, and direction"
    >
      <SourceSelector
        selectedSource={selectedSource}
        selectedDirection={selectedDirection}
        onSourceSelect={onSourceSelect}
        onDirectionSelect={onDirectionSelect}
      />
      
      {direction === "import" && sourceType === "file" && isConnected && (
        <div className="mt-4">
          <label className="text-sm font-medium">Select Target Table</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={selectedTable || ""}
            onChange={(e) => onTableSelect(e.target.value || null)}
          >
            <option value="">Select a table...</option>
            {tables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </DashboardCard>
  );
};

export default ConfigurationCard;
