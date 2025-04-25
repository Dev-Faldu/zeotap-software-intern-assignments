
import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FileUploader from "@/components/DataFlow/FileUploader";
import SchemaViewer from "@/components/DataFlow/SchemaViewer";
import ColumnSelector from "@/components/DataFlow/ColumnSelector";
import ConnectionCard from "@/components/DataFlow/ConnectionCard";
import ConfigurationCard from "@/components/DataFlow/ConfigurationCard";
import TransferControlCard from "@/components/DataFlow/TransferControlCard";
import { DataTransferProvider, useDataTransfer } from "@/context/DataTransferContext";
import DashboardCard from "@/components/UI/DashboardCard";
import { ConnectionDetails } from "@/components/Auth/ConnectionForm";
import { Table, Column } from "@/types";

const Index = () => {
  return (
    <DataTransferProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </DataTransferProvider>
  );
};

const Dashboard = () => {
  const {
    isConnected,
    isConnecting,
    connect,
    direction,
    sourceType,
    setDirection,
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
  } = useDataTransfer();

  const handleConnect = async (details: ConnectionDetails) => {
    await connect({
      host: details.host,
      port: parseInt(details.port) || 8123,
      username: details.username,
      database: details.database,
      jwtToken: details.jwtToken
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ClickHouse Data Bridge</h1>
      <p className="text-muted-foreground">
        Bidirectional data transfer between ClickHouse and flat files with schema discovery.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectionCard onConnect={handleConnect} isConnecting={isConnecting} />
        <ConfigurationCard
          selectedSource={sourceType}
          selectedDirection={direction}
          onSourceSelect={setSourceType}
          onDirectionSelect={setDirection}
          tables={tables}
          selectedTable={selectedTable}
          onTableSelect={setSelectedTable}
          isConnected={isConnected}
          direction={direction}
          sourceType={sourceType}
        />
      </div>
      
      {isConnected && direction && sourceType && (
        <>
          {sourceType === "file" && direction === "import" && (
            <div className="grid grid-cols-1 gap-6">
              <DashboardCard 
                title="File Upload" 
                description="Upload a CSV/TSV file to import"
              >
                <FileUploader 
                  onFileSelected={processFile}
                  isProcessing={isProcessingFile}
                />
              </DashboardCard>
            </div>
          )}
          
          {((sourceType === "file" && fileName) || 
            (sourceType === "clickhouse" && tables.length > 0)) && (
            <div className="grid grid-cols-1 gap-6">
              <DashboardCard 
                title="Schema Discovery" 
                description={sourceType === "file" ? fileName || "Uploaded file" : "Database tables"}
              >
                {sourceType === "file" && fileColumns.length > 0 && (
                  <SchemaViewer
                    tables={[{ 
                      name: fileName || "Uploaded File", 
                      columns: fileColumns 
                    }]}
                    onColumnSelectionChange={updateColumnSelection}
                  />
                )}
                
                {sourceType === "clickhouse" && (
                  <SchemaViewer
                    tables={tables.map(table => ({
                      name: table.name,
                      columns: table.columns.map(col => 
                        typeof col === 'string' 
                          ? { name: col, type: 'String', selected: true }
                          : col
                      )
                    } as Table))}
                    onColumnSelectionChange={updateColumnSelection}
                  />
                )}
              </DashboardCard>
            </div>
          )}
          
          {selectedColumns.length > 0 && (
            <TransferControlCard
              selectedColumns={selectedColumns}
              selectedTable={selectedTable}
              direction={direction}
              transferStats={transferStats}
              isTransferring={isTransferring}
              onStartTransfer={startTransfer}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
