import React from 'react';
import { Layout } from './components/Layout';
import { UrlForm } from './components/UrlForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useFileParser } from './hooks/useFileParser';

function App() {
  const {
    inputUrl,
    setInputUrl,
    isLoading,
    results,
    error,
    parseFiles,
    scanHistory,
    clearResults
  } = useFileParser();

  return (
    <Layout>
      <UrlForm
        inputUrl={inputUrl}
        setInputUrl={setInputUrl}
        parseFiles={parseFiles}
        isLoading={isLoading}
        clearResults={clearResults}
      />
      
      {error && (
        <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <ResultsDisplay 
        results={results} 
        isLoading={isLoading} 
        scanHistory={scanHistory}
      />
    </Layout>
  );
}

export default App;