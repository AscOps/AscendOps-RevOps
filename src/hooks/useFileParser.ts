import { useState, useCallback } from 'react';
import { parseAdsTxt, parseSellersJson } from '../services/parserService';
import { ResultEntry } from '../types';

export const useFileParser = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    
    let normalizedUrl = url.trim();
    
    // Remove trailing slashes
    normalizedUrl = normalizedUrl.replace(/\/+$/, '');
    
    // Add https:// if no protocol specified
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    return normalizedUrl;
  };

  const parseFiles = useCallback(async () => {
    if (!inputUrl.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResults([]);
    
    try {
      const normalizedUrl = normalizeUrl(inputUrl);
      
      // Add to scan history
      setScanHistory(prev => {
        const newHistory = [normalizedUrl, ...prev.filter(url => url !== normalizedUrl)];
        return newHistory.slice(0, 20); // Keep only last 20 entries
      });

      let fileContent: string;
      let parsedResults: ResultEntry[] = [];
      
      // Determine if this is an ads.txt or sellers.json URL
      if (normalizedUrl.toLowerCase().includes('sellers.json')) {
        // This is a sellers.json URL
        const response = await fetch(normalizedUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch sellers.json: ${response.statusText}`);
        }
        const jsonData = await response.json();
        parsedResults = parseSellersJson(jsonData);
      } else {
        // This is most likely an ads.txt URL
        // First, try the normalized URL directly
        try {
          const response = await fetch(`${normalizedUrl}/ads.txt`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ads.txt: ${response.statusText}`);
          }
          fileContent = await response.text();
          parsedResults = parseAdsTxt(fileContent);
        } catch (adsTxtError) {
          // If that fails, try without https:// (in case they entered a full URL)
          try {
            const urlObj = new URL(normalizedUrl);
            const domainOnly = urlObj.hostname;
            const adsTxtUrl = `https://${domainOnly}/ads.txt`;
            
            const response = await fetch(adsTxtUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch ads.txt: ${response.statusText}`);
            }
            fileContent = await response.text();
            parsedResults = parseAdsTxt(fileContent);
          } catch (error) {
            throw adsTxtError; // If both attempts fail, throw the original error
          }
        }
      }
      
      setResults(parsedResults);
    } catch (error) {
      setError((error as Error).message || 'Failed to parse file. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputUrl]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError('');
  }, []);

  return {
    inputUrl,
    setInputUrl,
    isLoading,
    results,
    error,
    parseFiles,
    scanHistory,
    clearResults
  };
};