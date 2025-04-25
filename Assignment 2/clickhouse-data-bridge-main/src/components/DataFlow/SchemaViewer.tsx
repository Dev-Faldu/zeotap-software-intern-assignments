import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Column } from "@/types";

export interface Table {
  name: string;
  columns: Column[];
}

interface SchemaViewerProps {
  tables: Table[];
  onColumnSelectionChange: (tableName: string, columnName: string, selected: boolean) => void;
  onTableSelect?: (tableName: string) => void;
}

const SchemaViewer = ({
  tables,
  onColumnSelectionChange,
  onTableSelect,
}: SchemaViewerProps) => {
  const [search, setSearch] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | undefined>(
    tables.length > 0 ? tables[0].name : undefined
  );

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    if (onTableSelect) {
      onTableSelect(tableName);
    }
  };

  const currentTable = tables.find((t) => t.name === selectedTable);

  const filteredColumns = currentTable
    ? currentTable.columns.filter((column) =>
        column.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-4">
      {tables.length > 1 && (
        <div className="space-y-2">
          <Label htmlFor="tableSelector">Select Table</Label>
          <Select value={selectedTable} onValueChange={handleTableSelect}>
            <SelectTrigger id="tableSelector">
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.name} value={table.name}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {currentTable && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {currentTable.name} ({currentTable.columns.length} columns)
            </h3>
            <Input
              placeholder="Search columns..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead className="hidden md:table-cell">Sample</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColumns.length > 0 ? (
                  filteredColumns.map((column) => (
                    <TableRow key={column.name}>
                      <TableCell>
                        <Checkbox
                          checked={column.selected}
                          onCheckedChange={(checked) =>
                            onColumnSelectionChange(
                              currentTable.name,
                              column.name,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          {column.type}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {column.sampleValue || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No columns found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default SchemaViewer;
