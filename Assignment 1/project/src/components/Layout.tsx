import React, { ReactNode } from 'react';
import { Database, Clock, Code, FlaskRound as Flask, Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'introduction', label: 'Introduction', icon: <Info className="w-5 h-5" /> },
    { id: 'grammar', label: 'Grammar', icon: <Code className="w-5 h-5" /> },
    { id: 'tokens', label: 'Token API', icon: <Database className="w-5 h-5" /> },
    { id: 'directive', label: 'Directives', icon: <Clock className="w-5 h-5" /> },
    { id: 'testing', label: 'Testing', icon: <Flask className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 flex items-center">
              <Database className="w-8 h-8 mr-2" />
              <h1 className="text-2xl font-bold">CDAP Wrangler Enhancement</h1>
            </div>
            <p className="text-blue-100">
              Supporting ByteSize and TimeDuration Units
            </p>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 bg-white rounded-lg shadow-md overflow-x-auto">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </div>
      
      <footer className="bg-gray-800 text-gray-300 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">CDAP Wrangler Enhancement</h3>
              <p className="text-sm mt-2">©2025 CDAP Engineering Team</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm">
                Built with modern engineering practices for production-ready code
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};