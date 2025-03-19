// src/types/market.ts

export interface MarketDataItem {
  symbol: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  date: string;
  // Campos adicionales que pueden venir de la API MarketStack
  adj_high?: number;
  adj_low?: number;
  adj_close?: number;
  adj_open?: number;
  adj_volume?: number;
  split_factor?: number;
  dividend?: number;
  exchange?: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  // Campos opcionales adicionales
  image?: string;
  category?: string;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'Bullish' | 'Bearish';
}

// Interfaz para los objetivos de precio
export interface PriceTargets {
  short_term: string;
  medium_term: string;
  long_term: string;
}

export interface PredictionResult {
  up: number;      // Probabilidad de que suba (porcentaje)
  down: number;    // Probabilidad de que baje (porcentaje)
  neutral: number; // Probabilidad de que se mantenga neutral (porcentaje)
  
  // Campos del análisis técnico
  key_fibonacci_levels: string[];
  fractal_signals: string[];
  market_structure: string;
  
  // Nuevos campos para indicadores adicionales
  rsi_analysis?: string[];
  macd_analysis?: string[];
  elliott_wave?: string[];
  volume_profile?: string[];
  ichimoku_signals?: string[];
  harmonic_patterns?: string[];
  
  // Objetivos de precio
  price_targets?: PriceTargets;
  
  // Resumen específico del stock
  stock_summary?: string;
  
  // Campos opcionales que podrían ser útiles
  confidence?: number;
  factors?: string[];
}

export interface PredictionResults {
  [index: string]: PredictionResult;
}

export interface FilteredData {
  marketData?: MarketDataItem[];
  stocksData?: MarketDataItem[];
  newsData?: NewsItem[];
  timeRange?: string;
}

// Añadimos una interfaz para las respuestas de la API MarketStack
export interface MarketStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: MarketDataItem[];
}

// También podríamos añadir una interfaz para el resumen general
export interface MarketAnalysisSummary {
  text: string;
  timestamp: string;
}

// Y una interfaz para la respuesta completa
export interface FullPredictionResponse {
  predictions: PredictionResults;
  summary?: string;
  timestamp: string;
  originalOutput?: string;
}