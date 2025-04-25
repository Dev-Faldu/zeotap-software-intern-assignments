import React, { useState } from 'react';

export const TokenImplementation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('byteSize');
  
  const byteSizeCode = `package io.cdap.wrangler.api.tokens;

import io.cdap.wrangler.api.Token;
import io.cdap.wrangler.api.TokenGroup;
import io.cdap.wrangler.api.TokenType;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Represents a byte size value with unit (KB, MB, GB, TB).
 * Handles parsing of human-readable byte size formats and conversion between units.
 */
public class ByteSize extends Token {
  private static final Pattern BYTE_SIZE_PATTERN = 
    Pattern.compile("(\\d+(?:\\.\\d+)?)([kKmMgGtT][bB])");
  
  private final double value;
  private final String unit;
  private final long bytes;
  
  /**
   * Constructor for ByteSize token.
   *
   * @param value The numeric value
   * @param unit The unit (KB, MB, GB, TB)
   */
  public ByteSize(double value, String unit) {
    super(TokenType.BYTE_SIZE);
    this.value = value;
    this.unit = unit.toUpperCase();
    this.bytes = calculateBytes(value, this.unit);
  }
  
  /**
   * Parse a string representation of byte size.
   *
   * @param byteSize String representation (e.g., "1.5KB", "10MB")
   * @return ByteSize token
   * @throws IllegalArgumentException if the format is invalid
   */
  public static ByteSize parse(String byteSize) {
    Matcher matcher = BYTE_SIZE_PATTERN.matcher(byteSize);
    if (!matcher.matches()) {
      throw new IllegalArgumentException(
        "Invalid byte size format: " + byteSize);
    }
    
    double value = Double.parseDouble(matcher.group(1));
    String unit = matcher.group(2);
    
    return new ByteSize(value, unit);
  }
  
  /**
   * Calculate the number of bytes based on value and unit.
   */
  private static long calculateBytes(double value, String unit) {
    switch (unit) {
      case "KB":
        return (long) (value * 1024);
      case "MB":
        return (long) (value * 1024 * 1024);
      case "GB":
        return (long) (value * 1024 * 1024 * 1024);
      case "TB":
        return (long) (value * 1024 * 1024 * 1024 * 1024);
      default:
        throw new IllegalArgumentException("Unknown unit: " + unit);
    }
  }
  
  /**
   * @return The raw value without unit
   */
  public double getValue() {
    return value;
  }
  
  /**
   * @return The unit (KB, MB, GB, TB)
   */
  public String getUnit() {
    return unit;
  }
  
  /**
   * @return The size in bytes
   */
  public long getBytes() {
    return bytes;
  }
  
  /**
   * @return The size in kilobytes
   */
  public double getKilobytes() {
    return bytes / 1024.0;
  }
  
  /**
   * @return The size in megabytes
   */
  public double getMegabytes() {
    return bytes / (1024.0 * 1024.0);
  }
  
  /**
   * @return The size in gigabytes
   */
  public double getGigabytes() {
    return bytes / (1024.0 * 1024.0 * 1024.0);
  }
  
  /**
   * @return Formatted byte size string
   */
  @Override
  public String toString() {
    return value + unit;
  }
}`;

  const timeDurationCode = `package io.cdap.wrangler.api.tokens;

import io.cdap.wrangler.api.Token;
import io.cdap.wrangler.api.TokenGroup;
import io.cdap.wrangler.api.TokenType;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Represents a time duration value with unit (ms, s, m, h, d).
 * Handles parsing of human-readable time duration formats and conversion between units.
 */
public class TimeDuration extends Token {
  private static final Pattern TIME_DURATION_PATTERN = 
    Pattern.compile("(\\d+(?:\\.\\d+)?)([mMsShHdD][sS]?)");
  
  private final double value;
  private final String unit;
  private final long milliseconds;
  
  /**
   * Constructor for TimeDuration token.
   *
   * @param value The numeric value
   * @param unit The unit (ms, s, m, h, d)
   */
  public TimeDuration(double value, String unit) {
    super(TokenType.TIME_DURATION);
    this.value = value;
    this.unit = unit.toLowerCase();
    this.milliseconds = calculateMilliseconds(value, this.unit);
  }
  
  /**
   * Parse a string representation of time duration.
   *
   * @param duration String representation (e.g., "500ms", "1.5s", "2h")
   * @return TimeDuration token
   * @throws IllegalArgumentException if the format is invalid
   */
  public static TimeDuration parse(String duration) {
    Matcher matcher = TIME_DURATION_PATTERN.matcher(duration);
    if (!matcher.matches()) {
      throw new IllegalArgumentException(
        "Invalid time duration format: " + duration);
    }
    
    double value = Double.parseDouble(matcher.group(1));
    String unit = matcher.group(2);
    
    return new TimeDuration(value, unit);
  }
  
  /**
   * Calculate the number of milliseconds based on value and unit.
   */
  private static long calculateMilliseconds(double value, String unit) {
    switch (unit) {
      case "ms":
        return (long) value;
      case "s":
        return (long) (value * 1000);
      case "m":
        return (long) (value * 60 * 1000);
      case "h":
        return (long) (value * 60 * 60 * 1000);
      case "d":
        return (long) (value * 24 * 60 * 60 * 1000);
      default:
        throw new IllegalArgumentException("Unknown unit: " + unit);
    }
  }
  
  /**
   * @return The raw value without unit
   */
  public double getValue() {
    return value;
  }
  
  /**
   * @return The unit (ms, s, m, h, d)
   */
  public String getUnit() {
    return unit;
  }
  
  /**
   * @return The duration in milliseconds
   */
  public long getMilliseconds() {
    return milliseconds;
  }
  
  /**
   * @return The duration in seconds
   */
  public double getSeconds() {
    return milliseconds / 1000.0;
  }
  
  /**
   * @return The duration in minutes
   */
  public double getMinutes() {
    return milliseconds / (60.0 * 1000.0);
  }
  
  /**
   * @return The duration in hours
   */
  public double getHours() {
    return milliseconds / (60.0 * 60.0 * 1000.0);
  }
  
  /**
   * @return Formatted time duration string
   */
  @Override
  public String toString() {
    return value + unit;
  }
}`;

  const tokenGroupUpdates = `package io.cdap.wrangler.api;

// TokenGroup.java updates

public class TokenGroup {
  // Add ByteSize and TimeDuration token types to the token type enum
  public enum TokenType {
    // Existing token types
    INTEGER, DOUBLE, STRING, BOOLEAN, COLUMN, EXPRESSION,
    
    // New token types
    BYTE_SIZE, TIME_DURATION
  }
  
  // Method to register new token types
  static {
    registerTokenType(TokenType.BYTE_SIZE, ByteSize.class);
    registerTokenType(TokenType.TIME_DURATION, TimeDuration.class);
  }
  
  // Update the getToken method to handle new token types
  public Token getToken(String value) {
    // Try parsing as ByteSize
    if (value.matches("\\d+(?:\\.\\d+)?[kKmMgGtT][bB]")) {
      return ByteSize.parse(value);
    }
    
    // Try parsing as TimeDuration
    if (value.matches("\\d+(?:\\.\\d+)?[mMsShHdD][sS]?")) {
      return TimeDuration.parse(value);
    }
    
    // Existing token type handling
    // ...
  }
}`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Token API Implementation</h2>
      
      <div className="prose max-w-none mb-6">
        <p>
          The token API includes two new Java classes that extend the base <code>Token</code> class: 
          <code>ByteSize</code> and <code>TimeDuration</code>. These classes handle parsing, 
          validation, and unit conversion for byte size and time duration values.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 ${activeTab === 'byteSize' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('byteSize')}
          >
            ByteSize.java
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'timeDuration' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('timeDuration')}
          >
            TimeDuration.java
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'tokenGroup' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('tokenGroup')}
          >
            TokenGroup Updates
          </button>
        </div>
        
        <div className="mt-4">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{activeTab === 'byteSize' 
              ? byteSizeCode 
              : activeTab === 'timeDuration' 
                ? timeDurationCode 
                : tokenGroupUpdates}</code>
          </pre>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">ByteSize Features</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Parses string representations like <code className="bg-blue-100 px-1.5 rounded">1KB</code>, <code className="bg-blue-100 px-1.5 rounded">10MB</code></li>
            <li>Supports case-insensitive units (kb, KB, Kb)</li>
            <li>Provides methods for unit conversion (getBytes, getKilobytes, etc.)</li>
            <li>Validates input format with regex pattern matching</li>
            <li>Calculates canonical byte value internally</li>
          </ul>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">TimeDuration Features</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Parses string representations like <code className="bg-green-100 px-1.5 rounded">500ms</code>, <code className="bg-green-100 px-1.5 rounded">1.5s</code>, <code className="bg-green-100 px-1.5 rounded">2h</code></li>
            <li>Supports case-insensitive units (ms, MS, s, S)</li>
            <li>Provides methods for unit conversion (getMilliseconds, getSeconds, etc.)</li>
            <li>Validates input format with regex pattern matching</li>
            <li>Calculates canonical millisecond value internally</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-100">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Implementation Notes</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Both token classes extend the base <code className="bg-yellow-100 px-1.5 rounded">Token</code> class</li>
          <li>Token type registration in <code className="bg-yellow-100 px-1.5 rounded">TokenGroup</code> ensures the parser recognizes the new types</li>
          <li>Regular expressions validate the input format</li>
          <li>Each token stores both the original value/unit and a canonical representation for calculations</li>
          <li>Utility methods facilitate easy conversion between different units</li>
        </ul>
      </div>
    </div>
  );
};