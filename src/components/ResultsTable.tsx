import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ResultEntry } from '../types';

interface ResultsTableProps {
  results: ResultEntry[];
}

type SortField = 'domain' | 'name' | 'type' | 'publisherId';
type SortDirection = 'asc' | 'desc';

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [sortField, setSortField] = useState<SortField>('domain');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    // Handle undefined values
    const valueA = a[sortField] ?? '';
    const valueB = b[sortField] ?? '';
    
    // Compare string values
    const comparison = String(valueA).localeCompare(String(valueB));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(field)}
      </div>
    </th>
  );

  // Determine if the results are from ads.txt or sellers.json based on properties
  const isSellerJson = results.length > 0 && 'name' in results[0] && results[0].name !== undefined;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {isSellerJson ? 'Sellers.json Results' : 'Ads.txt Results'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {results.length} entries found
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader('domain', 'Domain')}
              {isSellerJson && renderSortableHeader('name', 'Company Name')}
              {!isSellerJson && renderSortableHeader('publisherId', 'Publisher ID')}
              {renderSortableHeader('type', 'Type')}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relationship
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.domain}
                </td>
                {isSellerJson && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {result.name || '-'}
                  </td>
                )}
                {!isSellerJson && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {result.publisherId || '-'}
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {result.type || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    result.relationship === 'DIRECT' 
                      ? 'bg-green-100 text-green-800' 
                      : result.relationship === 'RESELLER'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {result.relationship || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {results.length === 0 && (
        <div className="px-6 py-4 text-center text-gray-500">
          No matching results found.
        </div>
      )}
    </div>
  );
};