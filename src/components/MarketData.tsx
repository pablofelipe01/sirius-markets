// src/components/MarketData.tsx
import React from 'react';
import { MarketDataItem } from '@/types/market';

interface MarketDataProps {
  title: string;
  data: MarketDataItem[];
}

const MarketData: React.FC<MarketDataProps> = ({ title, data = [] }) => {
  // Aseguramos que data sea siempre un array, incluso si es undefined
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      {safeData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Change</th>
                <th className="px-4 py-2 text-right">% Change</th>
                <th className="px-4 py-2 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {safeData.map((item, index) => {
                const changeValue = item.close - item.open;
                const changePercent = (changeValue / item.open) * 100;
                const isPositive = changeValue >= 0;
                
                return (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="px-4 py-2 font-medium">{item.symbol}</td>
                    <td className="px-4 py-2 text-right">${item.close.toFixed(2)}</td>
                    <td className={`px-4 py-2 text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{changeValue.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-right">{item.volume.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketData;