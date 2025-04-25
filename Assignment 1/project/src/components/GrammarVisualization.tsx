import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export const GrammarVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lexer');
  
  const lexerGrammar = `// Extended Lexer Grammar (Directives.g4)
lexer grammar Directives;

// ... existing tokens ...

// New tokens for byte sizes and time durations
BYTE_SIZE
  : DECIMAL (KB | MB | GB | TB)
  ;

TIME_DURATION
  : DECIMAL (MS | S | M | H | D)
  ;

fragment KB : [kK][bB] ;
fragment MB : [mM][bB] ;
fragment GB : [gG][bB] ;
fragment TB : [tT][bB] ;

fragment MS : [mM][sS] ;
fragment S  : [sS] ;
fragment M  : [mM] ;
fragment H  : [hH] ;
fragment D  : [dD] ;

DECIMAL
  : INT
  | INT '.' INT
  ;

fragment INT : [0-9]+ ;

// ... other token definitions ...`;

  const parserGrammar = `// Extended Parser Grammar (Directives.g4)
parser grammar DirectivesParser;

options {
  tokenVocab=Directives;
}

// ... existing rules ...

// Add support for byte size expressions
byteSizeExpr
  : BYTE_SIZE                # simpleByteSizeExpr
  | LPAREN byteSizeExpr RPAREN # nestedByteSizeExpr
  ;

// Add support for time duration expressions
timeDurationExpr
  : TIME_DURATION           # simpleTimeDurationExpr
  | LPAREN timeDurationExpr RPAREN # nestedTimeDurationExpr
  ;

// Update expression rule to include new types
expr
  : ... // existing expressions
  | byteSizeExpr            # byteSizeExpression
  | timeDurationExpr        # timeDurationExpression
  ;

// ... other rule definitions ...`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Grammar Enhancements</h2>
      
      <div className="prose max-w-none mb-6">
        <p>
          The ANTLR grammar has been extended to support byte size and time duration tokens. 
          These modifications allow the Wrangler parser to recognize and process expressions like 
          <code className="bg-gray-100 px-1.5 rounded">1.5KB</code> or <code className="bg-gray-100 px-1.5 rounded">500ms</code> as 
          first-class citizens in directives.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 ${activeTab === 'lexer' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('lexer')}
          >
            Lexer Rules
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'parser' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('parser')}
          >
            Parser Rules
          </button>
        </div>
        
        <div className="mt-4">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{activeTab === 'lexer' ? lexerGrammar : parserGrammar}</code>
          </pre>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Grammar Changes</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Added <code className="bg-blue-100 px-1.5 rounded">BYTE_SIZE</code> token for recognizing byte units</li>
            <li>Added <code className="bg-blue-100 px-1.5 rounded">TIME_DURATION</code> token for recognizing time units</li>
            <li>Created fragments for each unit (KB, MB, MS, S, etc.)</li>
            <li>Updated expression rules to support the new token types</li>
          </ul>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grammar Generation</h3>
          <p className="text-gray-700 mb-4">
            After updating the grammar files, the ANTLR tool generates the necessary Java classes:
          </p>
          <div className="bg-gray-800 text-green-300 p-3 rounded-md text-sm font-mono">
            $ antlr4 -visitor Directives.g4<br/>
            $ javac *.java
          </div>
          <div className="mt-4 text-gray-700">
            <p>Generated files:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>DirectivesLexer.java</li>
              <li>DirectivesParser.java</li>
              <li>DirectivesBaseVisitor.java</li>
              <li>DirectivesVisitor.java</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-gray-50">
        <p className="text-gray-700">
          Learn more about ANTLR grammar development in the official documentation.
        </p>
        <a 
          href="https://github.com/antlr/antlr4/blob/master/doc/index.md" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          ANTLR Docs <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};