
import React, { useState } from "react";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelected: (file: File, delimiter: string) => void;
  isProcessing?: boolean;
}

const FileUploader = ({ onFileSelected, isProcessing = false }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      simulateUploadProgress();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onFileSelected(file, delimiter);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center min-h-[200px]",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          file ? "bg-accent/10" : "bg-background"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="fileUpload"
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        {!file ? (
          <Label
            htmlFor="fileUpload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            <Upload className="h-12 w-12 text-primary/60" />
            <div className="text-center">
              <p className="font-semibold text-lg">Drag & drop your file here</p>
              <p className="text-muted-foreground text-sm">
                or click to browse (CSV, TSV, TXT)
              </p>
            </div>
          </Label>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <FileCheck className="h-12 w-12 text-accent" />
            <div className="text-center">
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-muted-foreground text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <>
          <Progress value={uploadProgress} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delimiter">Delimiter</Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delimiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="|">Pipe (|)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing || uploadProgress < 100}
              >
                {isProcessing ? "Processing..." : "Process File"}
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default FileUploader;
