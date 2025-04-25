
import React from "react";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-4 px-6 shadow-sm clickhouse-gradient", className)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-xl font-bold text-white">ClickHouse Data Bridge</h1>
            <p className="text-xs text-white/80">Bidirectional Data Ingestion Tool</p>
          </div>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-white hover:text-white/80 font-medium">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white font-medium">
                Connections
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white font-medium">
                Transfers
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white font-medium">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
