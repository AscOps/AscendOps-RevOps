import React, { useState } from 'react';
import { Download, Clock, Filter, ExternalLink } from 'lucide-react';
import { ResultsTable } from './ResultsTable';
import { ScanHistoryList } from './ScanHistoryList';
import { ResultEntry } from '../types';

interface ResultsDisplayProps {
  results: ResultEntry[];
  isLoading: boolean;
  scanHistory: string[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  isLoading,
  scanHistory
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');

  const filteredResults = results.filter(
    result => 
      result.domain.toLowerCase().includes(filterTerm.toLowerCase()) ||
      result.name?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      result.publisherId?.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const exportToCsv = () => {
    if (results.length === 0) return;
    
    // Get all unique keys from all objects
    const allKeys = Array.from(
      new Set(
        results.flatMap(obj => Object.keys(obj))
      )
    );
    
    // Create CSV header
    let csv = allKeys.join(',') + '\n';
    
    // Add each result as a row
    results.forEach(result => {
      const row = allKeys.map(key => {
        // Convert the value to string and escape quotes
        const value = result[key as keyof ResultEntry];
        const valueStr = value !== undefined ? String(value) : '';
        return `"${valueStr.replace(/"/g, '""')}"`;
      });
      
      csv += row.join(',') + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'ads_txt_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
              showHistory 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            History
          </button>
        </div>

        {results.length > 0 && (
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter results..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button 
              onClick={exportToCsv}
              className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {showHistory ? (
        <ScanHistoryList history={scanHistory} />
      ) : (
        results.length > 0 ? (
          <ResultsTable results={filteredResults} />
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-500 mb-6">
              Enter a URL above to analyze ads.txt or sellers.json files.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://iabtechlab.com/ads-txt/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Learn more about ads.txt
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        )
      )}
    </div>
  );
};