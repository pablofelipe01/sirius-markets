// src/components/StockSearch.tsx
import React, { useState } from 'react';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isSearching: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, isSearching }) => {
  const [stockSymbol, setStockSymbol] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockSymbol.trim()) {
      onSearch(stockSymbol.trim().toUpperCase());
    }
  };
  
  return (
    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Análisis de Stock Específico</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Ingrese símbolo del stock (ej: AAPL, MSFT, GOOGL)"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !stockSymbol.trim()}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            isSearching 
              ? 'bg-blue-800 text-gray-300' 
              : stockSymbol.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSearching ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando...
            </div>
          ) : (
            'Analizar Stock'
          )}
        </button>
      </form>
    </div>
  );
};

export default StockSearch;