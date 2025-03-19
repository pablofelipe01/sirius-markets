// src/components/FilterControls.tsx
import React, { useState } from 'react';
import { MarketDataItem, NewsItem, FilteredData } from '@/types/market';

interface FilterControlsProps {
  marketData: MarketDataItem[];
  stocksData: MarketDataItem[];
  newsData: NewsItem[];
  onApplyFilters: (filteredData: FilteredData) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  marketData = [], 
  stocksData = [], 
  newsData = [], 
  onApplyFilters 
}) => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1d');
  const [includeNews, setIncludeNews] = useState<boolean>(true);
  const [newsSources, setNewsSources] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Aseguramos que los datos sean siempre arrays
  const safeMarketData = Array.isArray(marketData) ? marketData : [];
  const safeStocksData = Array.isArray(stocksData) ? stocksData : [];
  const safeNewsData = Array.isArray(newsData) ? newsData : [];

  // Combinar símbolos de mercado y acciones
  const availableSymbols = [...new Set([
    ...safeMarketData.map(item => item.symbol),
    ...safeStocksData.map(item => item.symbol)
  ])];

  const availableNewsSources = [...new Set(
    safeNewsData.map(item => item.source)
  )];

  const handleSelectSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter(i => i !== symbol));
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const handleSelectNewsSource = (source: string) => {
    if (newsSources.includes(source)) {
      setNewsSources(newsSources.filter(s => s !== source));
    } else {
      setNewsSources([...newsSources, source]);
    }
  };

  const applyFilters = () => {
    setIsFiltering(true);
    
    // Filter the data based on selected criteria
    const filteredMarketData = selectedSymbols.length > 0
      ? safeMarketData.filter(item => selectedSymbols.includes(item.symbol))
      : safeMarketData;
      
    const filteredStocksData = selectedSymbols.length > 0
      ? safeStocksData.filter(item => selectedSymbols.includes(item.symbol))
      : safeStocksData;
      
    const filteredNewsData = includeNews
      ? (newsSources.length > 0
          ? safeNewsData.filter(item => newsSources.includes(item.source))
          : safeNewsData)
      : [];
    
    // Send filtered data to parent component for AI analysis
    onApplyFilters({
      marketData: filteredMarketData,
      stocksData: filteredStocksData,
      newsData: filteredNewsData,
      timeRange
    });
    
    setIsFiltering(false);
  };

  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Filter Controls</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Select Indices & Stocks</h3>
        <div className="flex flex-wrap gap-2">
          {availableSymbols.length > 0 ? (
            availableSymbols.map(symbol => (
              <button
                key={symbol}
                onClick={() => handleSelectSymbol(symbol)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedSymbols.includes(symbol)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {symbol}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No symbols available</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Time Range</h3>
        <div className="flex gap-2">
          {['1d', '5d', '1m', '3m', '6m', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="includeNews"
            checked={includeNews}
            onChange={() => setIncludeNews(!includeNews)}
            className="mr-2"
          />
          <label htmlFor="includeNews" className="font-medium">Include News</label>
        </div>
        
        {includeNews && (
          <div className="pl-6">
            <h4 className="font-medium mb-2">News Sources</h4>
            <div className="flex flex-wrap gap-2">
              {availableNewsSources.length > 0 ? (
                availableNewsSources.map(source => (
                  <button
                    key={source}
                    onClick={() => handleSelectNewsSource(source)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newsSources.includes(source)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {source}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No news sources available</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={applyFilters}
        disabled={isFiltering}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600"
      >
        {isFiltering ? 'Processing...' : 'Run AI Analysis'}
      </button>
    </div>
  );
};

export default FilterControls;