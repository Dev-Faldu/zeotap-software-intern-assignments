import React from 'react';
import { MessageSquare, Code, Clock, Database } from 'lucide-react';

export const Introduction: React.FC = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-blue-600" />,
      title: 'Grammar Enhancement',
      description: 'Extended ANTLR grammar with new BYTE_SIZE and TIME_DURATION tokens'
    },
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: 'Token API',
      description: 'New ByteSize and TimeDuration token classes with unit parsing'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: 'Parser Integration',
      description: 'Updated visitor pattern to handle the new token types'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: 'New Directives',
      description: 'Added aggregate-stats directive for working with byte and time values'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">CDAP Wrangler Enhancement</h2>
      
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700">
          This project enhances CDAP Wrangler to natively support byte size and time duration units in data processing workflows.
          The implementation includes grammar updates, token API extensions, and new directive functionality.
        </p>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="ml-2 text-xl font-semibold text-gray-800">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Project Objectives</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Enable parsing of human-readable units like <code className="bg-blue-100 px-2 rounded">1KB</code>, <code className="bg-blue-100 px-2 rounded">10MB</code>, <code className="bg-blue-100 px-2 rounded">500ms</code>, <code className="bg-blue-100 px-2 rounded">1.5s</code></li>
          <li>Facilitate aggregation operations over byte sizes and time durations</li>
          <li>Provide unit conversion capabilities</li>
          <li>Maintain backward compatibility with existing wrangler recipes</li>
          <li>Deliver comprehensive test coverage</li>
        </ul>
      </div>
    </div>
  );
};