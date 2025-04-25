
import React from "react";
import { Button } from "@/components/ui/button";
import { Database, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type SourceType = "clickhouse" | "file" | null;
export type Direction = "import" | "export" | null;

interface SourceSelectorProps {
  selectedSource: SourceType;
  selectedDirection: Direction;
  onSourceSelect: (source: SourceType) => void;
  onDirectionSelect: (direction: Direction) => void;
}

const SourceSelector = ({
  selectedSource,
  selectedDirection,
  onSourceSelect,
  onDirectionSelect,
}: SourceSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Data Direction</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={selectedDirection === "import" ? "default" : "outline"}
            className={cn(
              "w-full justify-start gap-2 h-20",
              selectedDirection === "import" && "border-primary"
            )}
            onClick={() => onDirectionSelect("import")}
          >
            <div className="flex flex-col items-start">
              <span className="text-lg">Import</span>
              <span className="text-xs opacity-70">Load data into ClickHouse</span>
            </div>
          </Button>
          
          <Button
            variant={selectedDirection === "export" ? "default" : "outline"}
            className={cn(
              "w-full justify-start gap-2 h-20",
              selectedDirection === "export" && "border-primary"
            )}
            onClick={() => onDirectionSelect("export")}
          >
            <div className="flex flex-col items-start">
              <span className="text-lg">Export</span>
              <span className="text-xs opacity-70">Extract data from ClickHouse</span>
            </div>
          </Button>
        </div>
      </div>

      {selectedDirection && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">
            {selectedDirection === "import"
              ? "Select Source"
              : "Select Target"}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedDirection === "import" ? (
              <>
                <Button
                  variant={selectedSource === "file" ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-2 h-24",
                    selectedSource === "file" && "border-primary"
                  )}
                  onClick={() => onSourceSelect("file")}
                >
                  <FileText className="h-6 w-6 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-lg">File</span>
                    <span className="text-xs opacity-70">CSV, TSV or text file</span>
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={selectedSource === "file" ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-2 h-24",
                    selectedSource === "file" && "border-primary"
                  )}
                  onClick={() => onSourceSelect("file")}
                >
                  <FileText className="h-6 w-6 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-lg">File</span>
                    <span className="text-xs opacity-70">Export to CSV or TSV</span>
                  </div>
                </Button>
                
                <Button
                  variant={selectedSource === "clickhouse" ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-2 h-24",
                    selectedSource === "clickhouse" && "border-primary"
                  )}
                  onClick={() => onSourceSelect("clickhouse")}
                >
                  <Database className="h-6 w-6 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-lg">ClickHouse</span>
                    <span className="text-xs opacity-70">Write to another database</span>
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceSelector;
