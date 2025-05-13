import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AdsTxt Explorer</h1>
            <div className="text-sm text-gray-500 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              <span>Extract data from ads.txt and sellers.json</span>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            AdsTxt Explorer • Analyze ads.txt and sellers.json files
          </p>
        </div>
      </footer>
    </div>
  );
};