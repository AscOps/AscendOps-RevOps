import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

interface ScanHistoryListProps {
  history: string[];
}

export const ScanHistoryList: React.FC<ScanHistoryListProps> = ({ history }) => {
  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      // If the URL has a protocol, parse it
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        return urlObj.hostname + urlObj.pathname;
      } 
      // Otherwise, just return the URL
      return url;
    } catch (error) {
      return url;
    }
  };

  // Determine if a URL is for ads.txt or sellers.json
  const getUrlType = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('sellers.json')) {
      return 'sellers.json';
    } else {
      return 'ads.txt';
    }
  };
  
  if (history.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Scan History</h3>
        <p className="text-gray-500">
          Your scan history will appear here once you analyze some URLs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Scan History</h3>
        <p className="text-sm text-gray-500 mt-1">
          Recently analyzed URLs
        </p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {history.map((url, index) => (
          <li key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatUrl(url)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Type: {getUrlType(url)}
                  </p>
                </div>
              </div>
              <a 
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                View
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};