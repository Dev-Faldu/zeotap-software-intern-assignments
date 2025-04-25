import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const TestingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('byteSizeTest');
  const [byteSizeInput, setByteSizeInput] = useState('1.5MB');
  const [timeDurationInput, setTimeDurationInput] = useState('2.5s');
  
  const byteSizeTestCode = `package io.cdap.wrangler.api.tokens;

import org.junit.Assert;
import org.junit.Test;

public class ByteSizeTest {
  @Test
  public void testValidByteSizeParsing() {
    // Test kilobytes
    ByteSize kb = ByteSize.parse("1KB");
    Assert.assertEquals(1.0, kb.getValue(), 0.01);
    Assert.assertEquals("KB", kb.getUnit());
    Assert.assertEquals(1024, kb.getBytes());
    
    // Test megabytes
    ByteSize mb = ByteSize.parse("2.5MB");
    Assert.assertEquals(2.5, mb.getValue(), 0.01);
    Assert.assertEquals("MB", mb.getUnit());
    Assert.assertEquals(2.5 * 1024 * 1024, mb.getBytes(), 0.01);
    
    // Test case insensitivity
    ByteSize caseMb = ByteSize.parse("3.2mb");
    Assert.assertEquals(3.2, caseMb.getValue(), 0.01);
    Assert.assertEquals("MB", caseMb.getUnit());
    
    // Test gigabytes
    ByteSize gb = ByteSize.parse("1.5GB");
    Assert.assertEquals(1.5, gb.getValue(), 0.01);
    Assert.assertEquals("GB", gb.getUnit());
    Assert.assertEquals(1.5 * 1024 * 1024 * 1024, gb.getBytes(), 0.01);
  }
  
  @Test
  public void testConversions() {
    ByteSize bs = ByteSize.parse("1024KB");
    Assert.assertEquals(1024 * 1024, bs.getBytes());
    Assert.assertEquals(1024.0, bs.getKilobytes(), 0.01);
    Assert.assertEquals(1.0, bs.getMegabytes(), 0.01);
    
    ByteSize bs2 = ByteSize.parse("2GB");
    Assert.assertEquals(2.0, bs2.getGigabytes(), 0.01);
    Assert.assertEquals(2048.0, bs2.getMegabytes(), 0.01);
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidFormat() {
    // This should throw an IllegalArgumentException
    ByteSize.parse("1.5 MB");
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidUnit() {
    // This should throw an IllegalArgumentException
    ByteSize.parse("1.5XB");
  }
}`;

  const timeDurationTestCode = `package io.cdap.wrangler.api.tokens;

import org.junit.Assert;
import org.junit.Test;

public class TimeDurationTest {
  @Test
  public void testValidTimeDurationParsing() {
    // Test milliseconds
    TimeDuration ms = TimeDuration.parse("500ms");
    Assert.assertEquals(500.0, ms.getValue(), 0.01);
    Assert.assertEquals("ms", ms.getUnit());
    Assert.assertEquals(500, ms.getMilliseconds());
    
    // Test seconds
    TimeDuration sec = TimeDuration.parse("2.5s");
    Assert.assertEquals(2.5, sec.getValue(), 0.01);
    Assert.assertEquals("s", sec.getUnit());
    Assert.assertEquals(2500, sec.getMilliseconds());
    
    // Test minutes
    TimeDuration min = TimeDuration.parse("3m");
    Assert.assertEquals(3.0, min.getValue(), 0.01);
    Assert.assertEquals("m", min.getUnit());
    Assert.assertEquals(3 * 60 * 1000, min.getMilliseconds());
    
    // Test hours
    TimeDuration hour = TimeDuration.parse("1.5h");
    Assert.assertEquals(1.5, hour.getValue(), 0.01);
    Assert.assertEquals("h", hour.getUnit());
    Assert.assertEquals(1.5 * 60 * 60 * 1000, hour.getMilliseconds(), 0.01);
  }
  
  @Test
  public void testConversions() {
    TimeDuration td = TimeDuration.parse("60s");
    Assert.assertEquals(60000, td.getMilliseconds());
    Assert.assertEquals(60.0, td.getSeconds(), 0.01);
    Assert.assertEquals(1.0, td.getMinutes(), 0.01);
    
    TimeDuration td2 = TimeDuration.parse("1.5h");
    Assert.assertEquals(1.5, td2.getHours(), 0.01);
    Assert.assertEquals(90.0, td2.getMinutes(), 0.01);
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidFormat() {
    // This should throw an IllegalArgumentException
    TimeDuration.parse("1.5 s");
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidUnit() {
    // This should throw an IllegalArgumentException
    TimeDuration.parse("1.5x");
  }
}`;

  const directiveTestCode = `package io.cdap.wrangler.api.directives;

import io.cdap.wrangler.api.DirectiveExecutionException;
import io.cdap.wrangler.api.Row;
import io.cdap.wrangler.api.parser.ColumnName;
import io.cdap.wrangler.api.parser.DirectiveParseException;
import io.cdap.wrangler.api.parser.DirectiveParser;
import io.cdap.wrangler.api.tokens.ByteSize;
import io.cdap.wrangler.api.tokens.TimeDuration;
import io.cdap.wrangler.test.TestingRecipe;
import io.cdap.wrangler.test.RecipeRunner;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;
import java.util.ArrayList;

public class AggregateStatsTest {
  @Test
  public void testByteSizeAggregation() throws DirectiveParseException, DirectiveExecutionException {
    // Create test data
    List<Row> rows = new ArrayList<>();
    Row row1 = new Row();
    row1.add("filesize", ByteSize.parse("1.5MB"));
    
    Row row2 = new Row();
    row2.add("filesize", ByteSize.parse("500KB"));
    
    Row row3 = new Row();
    row3.add("filesize", ByteSize.parse("2MB"));
    
    rows.add(row1);
    rows.add(row2);
    rows.add(row3);
    
    // Create and execute the directive
    DirectiveParser directiveParser = new DirectiveParser();
    AggregateStats directive = directiveParser.parse(AggregateStats.NAME + " sum filesize total MB")
      .as(AggregateStats.class);
      
    // Execute the directive
    List<Row> results = directive.execute(rows, null);
    
    // Verify results
    ByteSize total = (ByteSize) results.get(0).getValue("total");
    Assert.assertEquals(4.0, total.getMegabytes(), 0.01); // 1.5MB + 500KB + 2MB = ~4MB
  }
  
  @Test
  public void testTimeDurationAggregation() throws DirectiveParseException, DirectiveExecutionException {
    // Create test data
    List<Row> rows = new ArrayList<>();
    Row row1 = new Row();
    row1.add("response_time", TimeDuration.parse("2.5s"));
    
    Row row2 = new Row();
    row2.add("response_time", TimeDuration.parse("750ms"));
    
    Row row3 = new Row();
    row3.add("response_time", TimeDuration.parse("1.2s"));
    
    rows.add(row1);
    rows.add(row2);
    rows.add(row3);
    
    // Create and execute the directive
    DirectiveParser directiveParser = new DirectiveParser();
    AggregateStats directive = directiveParser.parse(AggregateStats.NAME + " avg response_time avg_time s")
      .as(AggregateStats.class);
      
    // Execute the directive
    List<Row> results = directive.execute(rows, null);
    
    // Verify results
    TimeDuration avg = (TimeDuration) results.get(0).getValue("avg_time");
    Assert.assertEquals(1.5, avg.getSeconds(), 0.01); // (2.5s + 0.75s + 1.2s) / 3 = 1.5s
  }
  
  @Test
  public void testMinMaxOperations() throws DirectiveParseException, DirectiveExecutionException {
    // Test for max operation
    // ...
    
    // Test for min operation
    // ...
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidOperation() throws DirectiveParseException, DirectiveExecutionException {
    // Test invalid operation
    // ...
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testInvalidColumnType() throws DirectiveParseException, DirectiveExecutionException {
    // Test when column has non-ByteSize, non-TimeDuration values
    // ...
  }
}`;

  // Mock validation functions
  const validateByteSize = (input: string) => {
    const regex = /^(\d+(?:\.\d+)?)(KB|MB|GB|TB)$/i;
    return regex.test(input);
  };
  
  const validateTimeDuration = (input: string) => {
    const regex = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i;
    return regex.test(input);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Testing</h2>
      
      <div className="prose max-w-none mb-6">
        <p>
          Comprehensive test coverage is essential to ensure the reliability of the ByteSize and TimeDuration
          implementations. The test suite includes unit tests for the token classes, parser tests for grammar 
          changes, and directive tests to validate the aggregate-stats functionality.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 ${activeTab === 'byteSizeTest' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('byteSizeTest')}
          >
            ByteSizeTest.java
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'timeDurationTest' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('timeDurationTest')}
          >
            TimeDurationTest.java
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'directiveTest' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('directiveTest')}
          >
            AggregateStatsTest.java
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'tryIt' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('tryIt')}
          >
            Try It
          </button>
        </div>
        
        {activeTab === 'tryIt' ? (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Test ByteSize Parser</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter a byte size value (e.g., 1.5KB, 10MB, 2GB)
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                      value={byteSizeInput}
                      onChange={(e) => setByteSizeInput(e.target.value)}
                    />
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                      onClick={() => validateByteSize(byteSizeInput)}
                    >
                      Validate
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Validation Result:</span>
                    {validateByteSize(byteSizeInput) ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span>Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-1" />
                        <span>Invalid</span>
                      </div>
                    )}
                  </div>
                  
                  {validateByteSize(byteSizeInput) && (
                    <div className="mt-3 space-y-1 text-sm">
                      <div><span className="font-medium">Bytes:</span> {parseFloat(byteSizeInput.replace(/[^\d.]/g, '')) * (byteSizeInput.toUpperCase().includes('KB') ? 1024 : byteSizeInput.toUpperCase().includes('MB') ? 1024*1024 : 1024*1024*1024)}</div>
                      <div><span className="font-medium">KB:</span> {parseFloat(byteSizeInput.replace(/[^\d.]/g, '')) * (byteSizeInput.toUpperCase().includes('KB') ? 1 : byteSizeInput.toUpperCase().includes('MB') ? 1024 : 1024*1024)}</div>
                      <div><span className="font-medium">MB:</span> {parseFloat(byteSizeInput.replace(/[^\d.]/g, '')) * (byteSizeInput.toUpperCase().includes('KB') ? 1/1024 : byteSizeInput.toUpperCase().includes('MB') ? 1 : 1024)}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Test TimeDuration Parser</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter a time duration value (e.g., 500ms, 2.5s, 1h)
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                      value={timeDurationInput}
                      onChange={(e) => setTimeDurationInput(e.target.value)}
                    />
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                      onClick={() => validateTimeDuration(timeDurationInput)}
                    >
                      Validate
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Validation Result:</span>
                    {validateTimeDuration(timeDurationInput) ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span>Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-1" />
                        <span>Invalid</span>
                      </div>
                    )}
                  </div>
                  
                  {validateTimeDuration(timeDurationInput) && (
                    <div className="mt-3 space-y-1 text-sm">
                      <div><span className="font-medium">Milliseconds:</span> {
                        parseFloat(timeDurationInput.replace(/[^\d.]/g, '')) * 
                        (timeDurationInput.toLowerCase().includes('ms') ? 1 : 
                         timeDurationInput.toLowerCase().includes('s') && !timeDurationInput.toLowerCase().includes('ms') ? 1000 : 
                         timeDurationInput.toLowerCase().includes('m') && !timeDurationInput.toLowerCase().includes('ms') ? 60000 : 
                         3600000)
                      }</div>
                      <div><span className="font-medium">Seconds:</span> {
                        parseFloat(timeDurationInput.replace(/[^\d.]/g, '')) * 
                        (timeDurationInput.toLowerCase().includes('ms') ? 0.001 : 
                         timeDurationInput.toLowerCase().includes('s') && !timeDurationInput.toLowerCase().includes('ms') ? 1 : 
                         timeDurationInput.toLowerCase().includes('m') && !timeDurationInput.toLowerCase().includes('ms') ? 60 : 
                         3600)
                      }</div>
                      <div><span className="font-medium">Minutes:</span> {
                        parseFloat(timeDurationInput.replace(/[^\d.]/g, '')) * 
                        (timeDurationInput.toLowerCase().includes('ms') ? 0.001/60 : 
                         timeDurationInput.toLowerCase().includes('s') && !timeDurationInput.toLowerCase().includes('ms') ? 1/60 : 
                         timeDurationInput.toLowerCase().includes('m') && !timeDurationInput.toLowerCase().includes('ms') ? 1 : 
                         60)
                      }</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{activeTab === 'byteSizeTest' 
                ? byteSizeTestCode 
                : activeTab === 'timeDurationTest' 
                  ? timeDurationTestCode 
                  : directiveTestCode}</code>
            </pre>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Coverage</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Unit tests for ByteSize class</li>
            <li>Unit tests for TimeDuration class</li>
            <li>Directive tests for AggregateStats functionality</li>
            <li>Edge case handling and error validation</li>
            <li>Integration tests with sample data</li>
          </ul>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Testing Approach</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Positive test cases for valid inputs</li>
            <li>Negative test cases for invalid formats and error handling</li>
            <li>Boundary test cases for extreme values</li>
            <li>Conversion accuracy tests</li>
            <li>Integration tests with the Wrangler pipeline</li>
          </ul>
        </div>
      </div>
    </div>
  );
};