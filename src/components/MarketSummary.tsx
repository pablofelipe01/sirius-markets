// src/components/MarketSummary.tsx
import React from 'react';

interface MarketSummaryProps {
  summaryText: string;
  timestamp: string;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({ summaryText, timestamp }) => {
  // Función para formatear la fecha/hora
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Dividir el texto en párrafos
  const paragraphs = summaryText.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resumen del Análisis de Mercado
        </h3>
        <span className="text-xs text-gray-400">
          {formatDate(timestamp)}
        </span>
      </div>
      
      <div className="prose prose-invert max-w-none">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="text-sm mb-3">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default MarketSummary;