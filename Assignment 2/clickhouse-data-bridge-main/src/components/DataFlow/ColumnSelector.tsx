import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";
import { Column } from "@/types";

interface ColumnSelectorProps {
  availableColumns: Column[];
  selectedColumns: Column[];
  onSelectionChange: (selected: Column[]) => void;
}

const ColumnSelector = ({
  availableColumns,
  selectedColumns,
  onSelectionChange,
}: ColumnSelectorProps) => {
  const [selectedAvailable, setSelectedAvailable] = React.useState<string[]>([]);
  const [selectedSelected, setSelectedSelected] = React.useState<string[]>([]);

  const handleSelectAll = () => {
    onSelectionChange([...availableColumns]);
    setSelectedAvailable([]);
  };

  const handleSelectSome = () => {
    const newSelected = [
      ...selectedColumns,
      ...availableColumns.filter(col => selectedAvailable.includes(col.name))
    ];
    onSelectionChange(newSelected);
    setSelectedAvailable([]);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
    setSelectedSelected([]);
  };

  const handleDeselectSome = () => {
    const newSelected = selectedColumns.filter(
      col => !selectedSelected.includes(col.name)
    );
    onSelectionChange(newSelected);
    setSelectedSelected([]);
  };

  const toggleAvailableColumn = (columnName: string) => {
    if (selectedAvailable.includes(columnName)) {
      setSelectedAvailable(selectedAvailable.filter(name => name !== columnName));
    } else {
      setSelectedAvailable([...selectedAvailable, columnName]);
    }
  };

  const toggleSelectedColumn = (columnName: string) => {
    if (selectedSelected.includes(columnName)) {
      setSelectedSelected(selectedSelected.filter(name => name !== columnName));
    } else {
      setSelectedSelected([...selectedSelected, columnName]);
    }
  };

  const filteredAvailable = availableColumns.filter(
    col => !selectedColumns.find(s => s.name === col.name)
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 border rounded-lg p-4">
        <h3 className="font-medium mb-2">Available Columns ({filteredAvailable.length})</h3>
        <div className="h-64 overflow-y-auto">
          <ul>
            {filteredAvailable.map(column => (
              <li
                key={column.name}
                className={`px-3 py-2 cursor-pointer rounded text-sm ${
                  selectedAvailable.includes(column.name) 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleAvailableColumn(column.name)}
              >
                <span className="font-medium">{column.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{column.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-row md:flex-col justify-center items-center gap-2">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleSelectAll}
          disabled={filteredAvailable.length === 0}
          title="Select all columns"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleSelectSome}
          disabled={selectedAvailable.length === 0}
          title="Select highlighted columns"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleDeselectSome}
          disabled={selectedSelected.length === 0}
          title="Remove highlighted columns"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleDeselectAll}
          disabled={selectedColumns.length === 0}
          title="Remove all columns"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 border rounded-lg p-4">
        <h3 className="font-medium mb-2">Selected Columns ({selectedColumns.length})</h3>
        <div className="h-64 overflow-y-auto">
          <ul>
            {selectedColumns.map(column => (
              <li
                key={column.name}
                className={`px-3 py-2 cursor-pointer rounded text-sm ${
                  selectedSelected.includes(column.name) 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleSelectedColumn(column.name)}
              >
                <span className="font-medium">{column.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{column.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColumnSelector;
