import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface UrlFormProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  parseFiles: () => void;
  clearResults: () => void;
  isLoading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({
  inputUrl,
  setInputUrl,
  parseFiles,
  clearResults,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseFiles();
  };

  const handleClear = () => {
    setInputUrl('');
    clearResults();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Check ads.txt and sellers.json</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter a website URL to extract information from its ads.txt or a sellers.json URL
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com or https://ssp.example.com/sellers.json)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
            disabled={isLoading}
          />
          {inputUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center
            ${isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          disabled={isLoading || !inputUrl.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              <span>Analyze</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};