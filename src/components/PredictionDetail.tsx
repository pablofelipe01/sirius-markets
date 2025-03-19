// src/components/PredictionDetail.tsx (actualizado)
import React from 'react';
import { PredictionResult } from '@/types/market';

interface PredictionDetailProps {
  symbol: string;
  prediction: PredictionResult;
}

const PredictionDetail: React.FC<PredictionDetailProps> = ({ symbol, prediction }) => {
  // Función para determinar el color de fondo según la tendencia predominante
  const getBgColor = () => {
    if (prediction.up > prediction.down && prediction.up > prediction.neutral) {
      return 'bg-gradient-to-r from-gray-800 to-green-900';
    } else if (prediction.down > prediction.up && prediction.down > prediction.neutral) {
      return 'bg-gradient-to-r from-gray-800 to-red-900';
    } else {
      return 'bg-gradient-to-r from-gray-800 to-blue-900';
    }
  };

  // Función para renderizar una lista de elementos con íconos adecuados
  const renderList = (items: string[] = [], iconType: string) => {
    if (!items || items.length === 0) return null;
    
    const getIcon = () => {
      switch (iconType) {
        case 'fibonacci':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          );
        case 'fractal':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          );
        case 'rsi':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          );
        case 'macd':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          );
        case 'elliott':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          );
        case 'volume':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          );
        case 'ichimoku':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          );
        case 'harmonic':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-3a1 1 0 00-1-1H6a2 2 0 110-4h1a1 1 0 001-1V9a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          );
        default:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    return (
      <ul className="space-y-1 mt-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="inline-block mr-2 mt-1">
              {getIcon()}
            </span>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Función para renderizar un indicador si existe
  const renderIndicator = (title: string, items: string[] = [], iconType: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-3">
        <h4 className="text-md font-semibold mb-1 border-b border-gray-700 pb-1 flex items-center">
          {iconType === 'rsi' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {iconType === 'macd' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          )}
          {iconType === 'elliott' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          {iconType === 'volume' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
          {iconType === 'ichimoku' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {iconType === 'harmonic' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-3a1 1 0 00-1-1H6a2 2 0 110-4h1a1 1 0 001-1V9a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          )}
          {iconType === 'fibonacci' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
          {iconType === 'fractal' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          )}
          {title}
        </h4>
        {renderList(items, iconType)}
      </div>
    );
  };

  return (
    <div className={`p-5 rounded-lg shadow-lg ${getBgColor()} text-white overflow-hidden`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold">{symbol}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${prediction.up > 50 ? 'bg-green-500' : 'bg-green-800'}`}>
            ↑ {prediction.up}%
          </span>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${prediction.down > 50 ? 'bg-red-500' : 'bg-red-800'}`}>
            ↓ {prediction.down}%
          </span>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${prediction.neutral > 50 ? 'bg-blue-500' : 'bg-blue-800'}`}>
            → {prediction.neutral}%
          </span>
        </div>
      </div>

      {renderIndicator("Niveles Fibonacci", prediction.key_fibonacci_levels, "fibonacci")}
      {renderIndicator("Señales Fractales", prediction.fractal_signals, "fractal")}
      
      {/* Nuevos indicadores técnicos */}
      {renderIndicator("Análisis RSI", prediction.rsi_analysis, "rsi")}
      {renderIndicator("Análisis MACD", prediction.macd_analysis, "macd")}
      {renderIndicator("Ondas de Elliott", prediction.elliott_wave, "elliott")}
      {renderIndicator("Perfil de Volumen", prediction.volume_profile, "volume")}
      {renderIndicator("Señales Ichimoku", prediction.ichimoku_signals, "ichimoku")}
      {renderIndicator("Patrones Armónicos", prediction.harmonic_patterns, "harmonic")}

      <div>
        <h4 className="text-md font-semibold mb-1 border-b border-gray-700 pb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Estructura del Mercado
        </h4>
        <p className="text-sm mt-2">{prediction.market_structure}</p>
      </div>
    </div>
  );
};

export default PredictionDetail;