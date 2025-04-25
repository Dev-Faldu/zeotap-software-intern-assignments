import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Introduction } from './components/Introduction';
import { GrammarVisualization } from './components/GrammarVisualization';
import { TokenImplementation } from './components/TokenImplementation';
import { DirectiveDemo } from './components/DirectiveDemo';
import { TestingSection } from './components/TestingSection';

function App() {
  const [activeTab, setActiveTab] = useState('introduction');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'introduction' && <Introduction />}
      {activeTab === 'grammar' && <GrammarVisualization />}
      {activeTab === 'tokens' && <TokenImplementation />}
      {activeTab === 'directive' && <DirectiveDemo />}
      {activeTab === 'testing' && <TestingSection />}
    </Layout>
  );
}

export default App;