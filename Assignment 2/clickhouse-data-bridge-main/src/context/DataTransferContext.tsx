import React, { createContext, useState, useContext, useEffect } from 'react';
import LocalStorage from '@/lib/localStorage';
import { TableSchema, Column, TransferStats, Table } from "@/types";
import { Direction, SourceType } from "@/components/DataFlow/SourceSelector";

export interface ConnectionDetails {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  jwtToken?: string;
}

interface DataTransferContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: (details: ConnectionDetails) => Promise<void>;
  disconnect: () => void;
  direction: Direction;
  setDirection: (direction: Direction) => void;
  sourceType: SourceType;
  setSourceType: (sourceType: SourceType) => void;
  tables: TableSchema[];
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  updateColumnSelection: (tableName: string, columnName: string, selected: boolean) => void;
  fileName: string | null;
  fileColumns: Column[];
  processFile: (file: File, delimiter: string) => Promise<void>;
  isProcessingFile: boolean;
  selectedColumns: Column[];
  setSelectedColumns: (columns: Column[]) => void;
  transferStats: TransferStats;
  startTransfer: () => Promise<void>;
  isTransferring: boolean;
}

const DataTransferContext = createContext<DataTransferContextType>({
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  direction: null,
  setDirection: () => {},
  sourceType: null,
  setSourceType: () => {},
  tables: [],
  selectedTable: null,
  setSelectedTable: () => {},
  updateColumnSelection: () => {},
  fileName: null,
  fileColumns: [],
  processFile: async () => {},
  isProcessingFile: false,
  selectedColumns: [],
  setSelectedColumns: () => {},
  transferStats: {
    status: "idle",
    startTime: null,
    endTime: null,
    rowsTransferred: 0,
    errors: [],
    logs: [],
  },
  startTransfer: async () => {},
  isTransferring: false,
});

export const useDataTransfer = () => useContext(DataTransferContext);

export const DataTransferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [direction, setDirection] = useState<Direction>(null);
  const [sourceType, setSourceType] = useState<SourceType>(null);
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileColumns, setFileColumns] = useState<Column[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [transferStats, setTransferStats] = useState<TransferStats>({
    status: "idle",
    startTime: null,
    endTime: null,
    rowsTransferred: 0,
    errors: [],
    logs: [],
  });
  const [isTransferring, setIsTransferring] = useState(false);
  
  const connect = async (details: ConnectionDetails) => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsConnected(true);
    setIsConnecting(false);
    
    // Simulate fetching tables
    const mockTables: TableSchema[] = [
      { name: "table1", columns: ["id", "name", "email"] },
      { name: "table2", columns: ["product_id", "product_name", "price"] },
    ];
    setTables(mockTables);

    LocalStorage.saveConnectionPreference({
      host: details.host,
      port: details.port,
      username: details.username
    });
  };
  
  const disconnect = () => {
    setIsConnected(false);
  };
  
  const processFile = async (file: File, delimiter: string) => {
    setIsProcessingFile(true);
    setFileName(file.name);
    
    // Simulate file processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock file columns
    const mockColumns: Column[] = [
      { name: "col1", type: "string", selected: false },
      { name: "col2", type: "number", selected: false },
      { name: "col3", type: "date", selected: false },
    ];
    setFileColumns(mockColumns);
    setIsProcessingFile(false);
  };
  
  const updateColumnSelection = (tableName: string, columnName: string, selected: boolean) => {
    console.log(`Column ${columnName} in table ${tableName} selected: ${selected}`);
    // Implement your column selection logic here
  };
  
  const startTransfer = async () => {
    setIsTransferring(true);
    setTransferStats({
      ...transferStats,
      status: "running",
      startTime: new Date(),
      logs: ["Starting transfer...", "Processing data..."]
    });
    
    // Simulate transfer delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTransferStats({
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      rowsTransferred: 100,
      errors: [],
      logs: ["Starting transfer...", "Processing data...", "Transfer completed successfully"]
    });
    setIsTransferring(false);

    LocalStorage.saveLastTransferConfig({
      sourceType,
      direction,
      selectedColumns: selectedColumns.map(col => col.name)
    });
  };

  useEffect(() => {
    const savedConnectionPreference = LocalStorage.getConnectionPreference();
    if (savedConnectionPreference) {
      // Populate connection form or set initial connection state
      // This is a placeholder - adjust based on your actual connection logic
      console.log('Loaded saved connection preference', savedConnectionPreference);
    }

    const lastTransferConfig = LocalStorage.getLastTransferConfig();
    if (lastTransferConfig) {
      // Restore last transfer configuration
      setSourceType(lastTransferConfig.sourceType);
      setDirection(lastTransferConfig.direction);
      
      // Convert string[] from localStorage to Column[]
      if (lastTransferConfig.selectedColumns) {
        setSelectedColumns(
          lastTransferConfig.selectedColumns.map(columnName => ({ 
            name: columnName,
            selected: true 
          }))
        );
      }
    }
  }, []);

  return (
    <DataTransferContext.Provider value={{
      isConnected,
      isConnecting,
      connect,
      disconnect,
      direction,
      setDirection,
      sourceType,
      setSourceType,
      tables,
      selectedTable,
      setSelectedTable,
      updateColumnSelection,
      fileName,
      fileColumns,
      processFile,
      isProcessingFile,
      selectedColumns,
      setSelectedColumns,
      transferStats,
      startTransfer,
      isTransferring,
    }}>
      {children}
    </DataTransferContext.Provider>
  );
};
