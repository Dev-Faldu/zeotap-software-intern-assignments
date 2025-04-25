
import React from "react";
import DashboardCard from "@/components/UI/DashboardCard";
import ConnectionForm, { ConnectionDetails } from "@/components/Auth/ConnectionForm";

interface ConnectionCardProps {
  onConnect: (details: ConnectionDetails) => void;
  isConnecting: boolean;
}

const ConnectionCard = ({ onConnect, isConnecting }: ConnectionCardProps) => {
  return (
    <DashboardCard 
      title="Connection Settings"
      description="Configure your ClickHouse connection"
    >
      <ConnectionForm onConnect={onConnect} isLoading={isConnecting} />
    </DashboardCard>
  );
};

export default ConnectionCard;
