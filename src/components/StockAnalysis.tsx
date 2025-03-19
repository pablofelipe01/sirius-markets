// src/components/StockAnalysis.tsx (actualizado)
import React from 'react';
import { PredictionResult } from '@/types/market';

// Interface for price targets
interface PriceTargets {
  short_term: string;
  medium_term: string;
  long_term: string;
}

// Extended prediction result interface that includes price targets
interface PredictionResultWithTargets extends PredictionResult {
  price_targets?: PriceTargets;
  stock_summary?: string;
}

interface StockAnalysisProps {
  symbol: string;
  prediction: PredictionResultWithTargets;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ symbol, prediction }) => {
  // Determine background gradient based on the dominant prediction
  const getBgGradient = () => {
    if (prediction.up > prediction.down && prediction.up > prediction.neutral) {
      return 'bg-gradient-to-br from-gray-900 to-green-900';
    } else if (prediction.down > prediction.up && prediction.down > prediction.neutral) {
      return 'bg-gradient-to-br from-gray-900 to-red-900';
    }
    return 'bg-gradient-to-br from-gray-900 to-blue-900';
  };

  // Función para renderizar una lista de elementos técnicos
  const renderTechnicalList = (items: string[] = [], iconComponent: React.ReactNode) => {
    if (!items || items.length === 0) return null;
    
    return (
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="inline-block mr-2 mt-1">
              {iconComponent}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Iconos para los diferentes indicadores
  const icons = {
    fibonacci: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    fractal: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    market: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    rsi: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    macd: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    elliott: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    volume: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    ichimoku: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    harmonic: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-3a1 1 0 00-1-1H6a2 2 0 110-4h1a1 1 0 001-1V9a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    price: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    summary: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${getBgGradient()} text-white mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{symbol}</h3>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm rounded-full font-medium ${prediction.up > 50 ? 'bg-green-600' : 'bg-green-800'}`}>
            ↑ {prediction.up}%
          </span>
          <span className={`px-3 py-1 text-sm rounded-full font-medium ${prediction.down > 50 ? 'bg-red-600' : 'bg-red-800'}`}>
            ↓ {prediction.down}%
          </span>
          <span className={`px-3 py-1 text-sm rounded-full font-medium ${prediction.neutral > 50 ? 'bg-blue-600' : 'bg-blue-800'}`}>
            → {prediction.neutral}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Niveles Fibonacci
          </h4>
          <ul className="space-y-2">
            {prediction.key_fibonacci_levels.map((level, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block mr-2 mt-1">
                  {icons.fibonacci}
                </span>
                <span>{level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Señales Fractales
          </h4>
          <ul className="space-y-2">
            {prediction.fractal_signals.map((signal, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block mr-2 mt-1">
                  {icons.fractal}
                </span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estructura del Mercado
        </h4>
        <p className="mt-2">{prediction.market_structure}</p>
      </div>

      {/* Nuevos indicadores técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {prediction.rsi_analysis && prediction.rsi_analysis.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Análisis RSI
            </h4>
            {renderTechnicalList(prediction.rsi_analysis, icons.rsi)}
          </div>
        )}

        {prediction.macd_analysis && prediction.macd_analysis.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Análisis MACD
            </h4>
            {renderTechnicalList(prediction.macd_analysis, icons.macd)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {prediction.elliott_wave && prediction.elliott_wave.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              Ondas de Elliott
            </h4>
            {renderTechnicalList(prediction.elliott_wave, icons.elliott)}
          </div>
        )}

        {prediction.volume_profile && prediction.volume_profile.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Perfil de Volumen
            </h4>
            {renderTechnicalList(prediction.volume_profile, icons.volume)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {prediction.ichimoku_signals && prediction.ichimoku_signals.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Señales Ichimoku
            </h4>
            {renderTechnicalList(prediction.ichimoku_signals, icons.ichimoku)}
          </div>
        )}

        {prediction.harmonic_patterns && prediction.harmonic_patterns.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-3a1 1 0 00-1-1H6a2 2 0 110-4h1a1 1 0 001-1V9a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              Patrones Armónicos
            </h4>
            {renderTechnicalList(prediction.harmonic_patterns, icons.harmonic)}
          </div>
        )}
      </div>

      {prediction.price_targets && (
        <div className="mt-6 mb-6">
          <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Objetivos de Precio
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Corto Plazo</h5>
              <p className="text-green-400 font-bold">{prediction.price_targets.short_term}</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Medio Plazo</h5>
              <p className="text-green-400 font-bold">{prediction.price_targets.medium_term}</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Largo Plazo</h5>
              <p className="text-green-400 font-bold">{prediction.price_targets.long_term}</p>
            </div>
          </div>
        </div>
      )}

      {prediction.stock_summary && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resumen del Análisis
          </h4>
          <div className="mt-2 bg-gray-800 bg-opacity-30 p-4 rounded">
            <p className="text-gray-100">{prediction.stock_summary}</p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center text-gray-400 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Este análisis se basa en patrones técnicos históricos y no constituye asesoramiento financiero.</span>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;