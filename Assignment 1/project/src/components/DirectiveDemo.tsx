import React, { useState } from 'react';

export const DirectiveDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('code');
  const [inputData, setInputData] = useState([
    { id: 1, download: '1.5MB', time: '3.2s' },
    { id: 2, download: '750KB', time: '850ms' },
    { id: 3, download: '2.8MB', time: '4.5s' },
    { id: 4, download: '500KB', time: '1.2s' }
  ]);
  
  const [operation, setOperation] = useState('sum');
  const [sourceColumn, setSourceColumn] = useState('download');
  const [targetColumn, setTargetColumn] = useState('result');
  const [outputUnit, setOutputUnit] = useState('MB');
  
  const directiveCode = `package io.cdap.wrangler.api.directives;

import io.cdap.wrangler.api.Arguments;
import io.cdap.wrangler.api.Directive;
import io.cdap.wrangler.api.ErrorRowException;
import io.cdap.wrangler.api.ExecutorContext;
import io.cdap.wrangler.api.Row;
import io.cdap.wrangler.api.annotations.Categories;
import io.cdap.wrangler.api.annotations.Description;
import io.cdap.wrangler.api.parser.ColumnName;
import io.cdap.wrangler.api.parser.TokenType;
import io.cdap.wrangler.api.parser.UsageDefinition;
import io.cdap.wrangler.api.tokens.ByteSize;
import io.cdap.wrangler.api.tokens.TimeDuration;

import java.util.List;
import java.util.function.BiFunction;

/**
 * Directive to aggregate byte size or time duration values.
 */
@Description("Aggregates byte size or time duration values")
@Categories({"transform", "aggregate"})
public class AggregateStats implements Directive {
  public static final String NAME = "aggregate-stats";
  private String source;
  private String destination;
  private String operation;
  private String outputUnit;
  
  @Override
  public UsageDefinition define() {
    UsageDefinition.Builder builder = UsageDefinition.builder(NAME);
    builder.define("operation", TokenType.IDENTIFIER);
    builder.define("source", TokenType.COLUMN_NAME);
    builder.define("destination", TokenType.COLUMN_NAME);
    builder.define("output-unit", TokenType.STRING, Optional.TRUE);
    return builder.build();
  }
  
  @Override
  public void initialize(Arguments args) {
    this.operation = args.value("operation").toLowerCase();
    this.source = ((ColumnName) args.value("source")).value();
    this.destination = ((ColumnName) args.value("destination")).value();
    if (args.contains("output-unit")) {
      this.outputUnit = args.value("output-unit").toString();
    }
  }
  
  @Override
  public List<Row> execute(List<Row> rows, ExecutorContext context) throws ErrorRowException {
    if (rows.isEmpty()) {
      return rows;
    }
    
    Object firstValue = rows.get(0).getValue(source);
    
    // Handle byte size aggregation
    if (firstValue instanceof ByteSize) {
      aggregateByteSize(rows);
    } 
    // Handle time duration aggregation
    else if (firstValue instanceof TimeDuration) {
      aggregateTimeDuration(rows);
    } 
    // Unsupported type
    else {
      throw new IllegalArgumentException(
        "Column '" + source + "' must contain byte size or time duration values");
    }
    
    return rows;
  }
  
  /**
   * Aggregate byte size values in the specified column.
   */
  private void aggregateByteSize(List<Row> rows) {
    switch (operation) {
      case "sum":
        long sum = 0;
        for (Row row : rows) {
          ByteSize byteSize = (ByteSize) row.getValue(source);
          sum += byteSize.getBytes();
        }
        
        // Convert to the requested output unit
        double result;
        String unit = outputUnit != null ? outputUnit.toUpperCase() : "B";
        switch (unit) {
          case "KB": result = sum / 1024.0; break;
          case "MB": result = sum / (1024.0 * 1024.0); break;
          case "GB": result = sum / (1024.0 * 1024.0 * 1024.0); break;
          default: result = sum;
        }
        
        // Add result to each row
        for (Row row : rows) {
          row.add(destination, new ByteSize(result, unit));
        }
        break;
        
      case "avg":
        double avg = (double) rows.stream()
          .mapToLong(row -> ((ByteSize) row.getValue(source)).getBytes())
          .sum() / rows.size();
          
        // Similar unit conversion and result addition
        // ...
        break;
        
      case "max":
      case "min":
        // Implementation for max/min operations
        // ...
        break;
        
      default:
        throw new IllegalArgumentException(
          "Unsupported operation: " + operation);
    }
  }
  
  /**
   * Aggregate time duration values in the specified column.
   */
  private void aggregateTimeDuration(List<Row> rows) {
    // Similar implementation to aggregateByteSize but for TimeDuration
    // ...
  }
}`;

  const calculateResult = () => {
    let result = 0;
    
    if (sourceColumn === 'download') {
      // Convert all values to KB for calculation
      const values = inputData.map(row => {
        const val = row.download;
        if (val.endsWith('KB')) {
          return parseFloat(val.replace('KB', ''));
        } else if (val.endsWith('MB')) {
          return parseFloat(val.replace('MB', '')) * 1024;
        }
        return 0;
      });
      
      // Perform the operation
      if (operation === 'sum') {
        result = values.reduce((a, b) => a + b, 0);
      } else if (operation === 'avg') {
        result = values.reduce((a, b) => a + b, 0) / values.length;
      } else if (operation === 'max') {
        result = Math.max(...values);
      } else if (operation === 'min') {
        result = Math.min(...values);
      }
      
      // Convert to the selected output unit
      if (outputUnit === 'MB') {
        result = result / 1024;
        return result.toFixed(2) + ' MB';
      } else {
        return result.toFixed(2) + ' KB';
      }
    } else {
      // Convert all values to ms for calculation
      const values = inputData.map(row => {
        const val = row.time;
        if (val.endsWith('ms')) {
          return parseFloat(val.replace('ms', ''));
        } else if (val.endsWith('s')) {
          return parseFloat(val.replace('s', '')) * 1000;
        }
        return 0;
      });
      
      // Perform the operation
      if (operation === 'sum') {
        result = values.reduce((a, b) => a + b, 0);
      } else if (operation === 'avg') {
        result = values.reduce((a, b) => a + b, 0) / values.length;
      } else if (operation === 'max') {
        result = Math.max(...values);
      } else if (operation === 'min') {
        result = Math.min(...values);
      }
      
      // Convert to the selected output unit
      if (outputUnit === 's') {
        result = result / 1000;
        return result.toFixed(2) + ' s';
      } else {
        return result.toFixed(0) + ' ms';
      }
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Directive Implementation</h2>
      
      <div className="prose max-w-none mb-6">
        <p>
          The <code>aggregate-stats</code> directive allows users to perform aggregation operations 
          on columns containing byte size or time duration values. The implementation follows 
          the standard directive pattern in Wrangler and supports operations like sum, average, 
          minimum, and maximum.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 ${activeTab === 'code' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('code')}
          >
            Implementation
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'demo' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('demo')}
          >
            Interactive Demo
          </button>
        </div>
        
        {activeTab === 'code' ? (
          <div className="mt-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{directiveCode}</code>
            </pre>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="max">Maximum</option>
                  <option value="min">Minimum</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Column</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={sourceColumn}
                  onChange={(e) => setSourceColumn(e.target.value)}
                >
                  <option value="download">download (ByteSize)</option>
                  <option value="time">time (TimeDuration)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Column</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Unit</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={outputUnit}
                  onChange={(e) => setOutputUnit(e.target.value)}
                >
                  {sourceColumn === 'download' ? (
                    <>
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </>
                  ) : (
                    <>
                      <option value="ms">ms</option>
                      <option value="s">s</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">ID</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Download Size</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Response Time</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">{targetColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {inputData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 border-t border-gray-200">{row.id}</td>
                      <td className="py-2 px-4 border-t border-gray-200">{row.download}</td>
                      <td className="py-2 px-4 border-t border-gray-200">{row.time}</td>
                      <td className="py-2 px-4 border-t border-gray-200 font-medium text-blue-600">
                        {calculateResult()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Directive Syntax</h4>
              <code className="block bg-white p-3 rounded border border-blue-200 text-blue-800">
                aggregate-stats {operation} {sourceColumn} {targetColumn} {outputUnit}
              </code>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Supports multiple aggregation operations: sum, avg, min, max</li>
            <li>Works with both ByteSize and TimeDuration values</li>
            <li>Allows specifying the output unit</li>
            <li>Intelligently handles unit conversions</li>
            <li>Proper error handling for invalid inputs</li>
          </ul>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Examples</h3>
          <div className="space-y-3">
            <div>
              <code className="block bg-white p-2 rounded border border-green-200 text-green-800">
                aggregate-stats sum filesize total_size MB
              </code>
              <p className="text-sm text-gray-600 mt-1">Sum all filesize values and store the result in MB</p>
            </div>
            <div>
              <code className="block bg-white p-2 rounded border border-green-200 text-green-800">
                aggregate-stats avg response_time avg_time s
              </code>
              <p className="text-sm text-gray-600 mt-1">Calculate average response time in seconds</p>
            </div>
            <div>
              <code className="block bg-white p-2 rounded border border-green-200 text-green-800">
                aggregate-stats max memory_usage peak_memory KB
              </code>
              <p className="text-sm text-gray-600 mt-1">Find the maximum memory usage in KB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};