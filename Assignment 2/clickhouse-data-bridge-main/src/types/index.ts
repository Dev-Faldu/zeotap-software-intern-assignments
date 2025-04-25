
// Table schema definition
export interface TableSchema {
  name: string;
  columns: string[];
}

// Table definition with columns
export interface Table {
  name: string;
  columns: Column[];
}

// Column definition with extended properties
export interface Column {
  name: string;
  type: string; // Changed from optional to required
  selected?: boolean;
  sampleValue?: string;
}

// Transfer statistics interface
export interface TransferStats {
  status: "idle" | "running" | "completed" | "error" | "failed";
  startTime: Date | null;
  endTime: Date | null;
  rowsTransferred: number;
  errors: string[];
  logs: string[];
  recordsTotal?: number;
  recordsProcessed?: number;
  errorMessage?: string;
}
