
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "@/types";

interface FileProcessorHookReturn {
  processFile: (file: File, delimiter: string) => Promise<void>;
  fileData: any[];
  fileColumns: Column[];
  isProcessing: boolean;
  fileName: string | null;
  error: string | null;
}

export const useFileProcessor = (): FileProcessorHookReturn => {
  const { toast } = useToast();
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileColumns, setFileColumns] = useState<Column[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const inferDataType = (value: string): string => {
    if (value === "") return "String";
    if (!isNaN(Number(value)) && value.indexOf('.') !== -1) return "Float64";
    if (!isNaN(Number(value))) return "Int64";
    if (!isNaN(Date.parse(value))) return "DateTime";
    return "String";
  };
  
  const processFile = async (file: File, delimiter: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        throw new Error("File is empty");
      }
      
      const headerRow = lines[0].split(delimiter);
      const dataRows: any[] = [];
      
      // Parse header and infer types from first data row
      const columns: Column[] = [];
      const firstDataRow = lines.length > 1 ? lines[1].split(delimiter) : [];
      
      headerRow.forEach((header, index) => {
        const columnName = header.trim();
        const sampleValue = firstDataRow[index] ? firstDataRow[index].trim() : "";
        const dataType = inferDataType(sampleValue);
        
        columns.push({
          name: columnName,
          type: dataType,
          selected: true,
          sampleValue,
        });
      });
      
      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter);
        const dataRow: Record<string, any> = {};
        
        headerRow.forEach((header, index) => {
          const columnName = header.trim();
          const value = values[index] ? values[index].trim() : "";
          dataRow[columnName] = value;
        });
        
        dataRows.push(dataRow);
      }
      
      setFileColumns(columns);
      setFileData(dataRows);
      
      toast({
        title: "File Processed Successfully",
        description: `${file.name}: ${dataRows.length} rows, ${columns.length} columns`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
      
      toast({
        variant: "destructive",
        title: "Error Processing File",
        description: err instanceof Error ? err.message : "Failed to process file",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processFile,
    fileData,
    fileColumns,
    isProcessing,
    fileName,
    error,
  };
};
