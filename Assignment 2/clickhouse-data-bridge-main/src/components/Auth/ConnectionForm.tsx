import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ConnectionFormProps {
  onConnect: (connectionDetails: ConnectionDetails) => void;
  isLoading?: boolean;
}

export interface ConnectionDetails {
  host: string;
  port: string;
  username: string;
  database: string;
  jwtToken: string;
}

const ConnectionForm = ({ onConnect, isLoading = false }: ConnectionFormProps) => {
  const { toast } = useToast();
  
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({
    host: "",
    port: "8123",
    username: "",
    database: "default",
    jwtToken: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConnectionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectionDetails.host || !connectionDetails.jwtToken) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide host and JWT token to connect",
      });
      return;
    }
    
    onConnect(connectionDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            name="host"
            value={connectionDetails.host}
            onChange={handleChange}
            placeholder="e.g., play.clickhouse.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            name="port"
            value={connectionDetails.port}
            onChange={handleChange}
            placeholder="8123"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={connectionDetails.username}
            onChange={handleChange}
            placeholder="default"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="database">Database</Label>
          <Input
            id="database"
            name="database"
            value={connectionDetails.database}
            onChange={handleChange}
            placeholder="default"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jwtToken">JWT Token</Label>
        <Textarea
          id="jwtToken"
          name="jwtToken"
          value={connectionDetails.jwtToken}
          onChange={handleChange}
          placeholder="Enter your JWT token for authentication"
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">
          JWT token is required for secure authentication with ClickHouse.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>Testing Connection...</>
        ) : (
          <>Test Connection</>
        )}
      </Button>
    </form>
  );
};

export default ConnectionForm;
