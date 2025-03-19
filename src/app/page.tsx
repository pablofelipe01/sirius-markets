// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import MarketData from '@/components/MarketData';
import NewsSection from '@/components/NewsSection';
import ApiTester from '@/components/ApiTester';
import WebhookButton from '@/components/WebhookButton';
import PredictionDetail from '@/components/PredictionDetail';
import MarketSummary from '@/components/MarketSummary';
import StockSearch from '@/components/StockSearch';
import StockAnalysis from '@/components/StockAnalysis';
import { marketStackService, newsService, newsAPIService } from '@/lib/api-services';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { webhookService } from '@/lib/webhook-service';
import { MarketDataItem, NewsItem, PredictionResults, PredictionResult } from '@/types/market';
import { mockMarketData, mockStocksData, mockNewsData } from '@/mocks/testData';

// Define the extended prediction result interface for stock analysis
interface PriceTargets {
  short_term: string;
  medium_term: string;
  long_term: string;
}

interface StockPredictionResult extends PredictionResult {
  price_targets?: PriceTargets;
  stock_summary?: string;
}

export default function Home() {
  const [apiSource, setApiSource] = useState<'live' | 'mock'>('live');
  const [apiError, setApiError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [marketData, setMarketData] = useState<MarketDataItem[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>(new Date().toISOString());
  const [showApiTester, setShowApiTester] = useState<boolean>(false);
  const [stocksData, setStocksData] = useState<MarketDataItem[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string | null>(null);
  const [stockAnalysis, setStockAnalysis] = useState<StockPredictionResult | null>(null);
  const [isSearchingStock, setIsSearchingStock] = useState<boolean>(false);

  // Define los símbolos para los índices y acciones
  const indexSymbols = ['^DJI', '^GSPC', '^IXIC'];
  const stockSymbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'NFLX'];

  // URL for the stock-specific webhook
  const STOCK_ANALYSIS_WEBHOOK_URL = 'https://n8n-sirius-agentic.onrender.com/webhook/stocks';
  // URL for the market analysis webhook
  const MARKET_ANALYSIS_WEBHOOK_URL = 'https://n8n-sirius-agentic.onrender.com/webhook/market';

  // Función auxiliar para extraer JSON válido de una cadena
  const extractValidJSON = (text: string): string | null => {
    let braceCount = 0;
    let startIndex = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') {
        if (braceCount === 0) startIndex = i;
        braceCount++;
      } else if (text[i] === '}') {
        braceCount--;
        if (braceCount === 0 && startIndex !== -1) {
          return text.substring(startIndex, i + 1);
        }
      }
    }
    
    return null;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      setApiError(null);
      
      try {
        // Intentar obtener datos reales
        await fetchRealData();
      } catch (error) {
        let errorMessage = 'Unknown error occurred';
        
        if (axios.isAxiosError(error)) {
          // Para errores de Axios, preparamos un mensaje más informativo
          const statusCode = error.response?.status;
          if (statusCode === 401) {
            errorMessage = 'API key authentication failed. Please check your API key.';
          } else if (statusCode === 422) {
            errorMessage = 'Invalid request. The symbols may not be supported or formatted correctly.';
          } else if (statusCode === 429) {
            errorMessage = 'API rate limit exceeded. Please try again later or upgrade your plan.';
          } else {
            errorMessage = `API error (${statusCode || 'unknown'}): ${error.message}`;
          }
          
          // Si tenemos datos detallados del error, los agregamos
          if (error.response?.data?.error?.message) {
            errorMessage += ` - ${error.response.data.error.message}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        // Guardamos el error de API para mostrarlo al usuario
        setApiError(errorMessage);
        console.error('Error fetching real data:', errorMessage);
        console.log('Falling back to mock data');
        setMockData();
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRealData = async () => {
      try {
        // Primero intentamos obtener datos para acciones populares
        // Usar stockSymbols definido arriba para resolver la advertencia de ESLint
        const stocks = await marketStackService.getPopularStocks(stockSymbols);
        setStocksData(stocks);
        
        try {
          // Luego intentamos obtener los índices
          const indices = await marketStackService.getEndOfDayData(indexSymbols);
          setMarketData(indices);
        } catch (indexError) {
          console.warn('Unable to fetch indices, using only stock data:', indexError);
          // Si no podemos obtener índices, usamos acciones como principal
          setMarketData(stocks.slice(0, 3));  // Usar primeras 3 acciones como sustituto
        }

        // Obtener noticias
        const news = await fetchNews();
        setNewsData(news);
        
        setApiSource('live');
      } catch (error) {
        // Re-lanzamos el error para que lo maneje fetchAllData
        throw error;
      }
    };

    const fetchNews = async (): Promise<NewsItem[]> => {
      try {
        // Intentar obtener noticias de Alpha Vantage primero
        if (process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY) {
          return await newsService.getFinancialNews();
        }
        
        // Si no hay clave de Alpha Vantage, intentar con NewsAPI
        if (process.env.NEXT_PUBLIC_NEWSAPI_KEY) {
          return await newsAPIService.getFinancialNews();
        }
        
        // Si ninguna API está configurada, usar datos simulados
        throw new Error('No news API configured');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.warn('Using mock news data');
        // Usar datos simulados importados
        return mockNewsData;
      }
    };

    // Función para establecer datos simulados
    const setMockData = () => {
      setMarketData(mockMarketData);
      setStocksData(mockStocksData);
      setNewsData(mockNewsData);
      setApiSource('mock');
    };

    fetchAllData();
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchAllData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Función para analizar un stock específico
  const handleStockSearch = async (symbol: string) => {
    try {
      setIsSearchingStock(true);
      setError(null);
      
      console.log('Analyzing specific stock:', symbol);
      
      // Normalizar el símbolo (convertir a mayúsculas)
      const normalizedSymbol = symbol.toUpperCase();
      
      // Intentar obtener datos para este símbolo si no existe en stocksData
      let stockData = stocksData.find(stock => stock.symbol === normalizedSymbol);
      
      if (!stockData) {
        console.log(`Stock data not in cache for ${normalizedSymbol}, fetching...`);
        try {
          // Intentar obtener datos para este nuevo símbolo
          const fetchedStockData = await marketStackService.getStockData(normalizedSymbol);
          
          if (fetchedStockData) {
            stockData = fetchedStockData;
            
            // Actualizar stocksData con el nuevo símbolo para futuras referencias
            setStocksData(prev => [...prev, fetchedStockData]);
          } else {
            setError(`No data available for stock symbol: ${symbol}`);
            setIsSearchingStock(false);
            return;
          }
        } catch (fetchError) {
          console.error(`Error fetching data for ${normalizedSymbol}:`, fetchError);
          setError(`No se pudo obtener datos para el símbolo: ${symbol}`);
          setIsSearchingStock(false);
          return;
        }
      }
      
      // Preparar los datos del stock para el análisis
      const dataToSend = {
        targetStock: normalizedSymbol,
        stockData: stockData, 
        marketData: marketData,
        newsData: newsData.filter(news => 
          news.title.includes(normalizedSymbol) || 
          news.summary.includes(normalizedSymbol)
        ),
        timestamp: new Date().toISOString(),
        dataSource: apiSource
      };
      
      // Send the request to the stock-specific webhook
      const response = await axios.post(
        STOCK_ANALYSIS_WEBHOOK_URL,
        dataToSend
      );
      
      console.log('Stock analysis response:', response.data);
      
      // Process the response
      if (response.data && typeof response.data === 'object') {
        if (response.data.predictions && response.data.predictions[normalizedSymbol]) {
          setStockSymbol(normalizedSymbol);
          setStockAnalysis(response.data.predictions[normalizedSymbol] as StockPredictionResult);
          
          // Scroll to the stock analysis section
          setTimeout(() => {
            const stockAnalysisElement = document.getElementById('stock-analysis');
            if (stockAnalysisElement) {
              stockAnalysisElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          setError(`No se pudo obtener análisis para el símbolo: ${symbol}`);
        }
      } else {
        setError('Formato de respuesta no reconocido');
      }
    } catch (err) {
      console.error('Error analyzing stock:', err);
      setError(`Error al analizar el stock ${symbol}. Por favor, intente de nuevo.`);
    } finally {
      setIsSearchingStock(false);
    }
  };

  // Send data to n8n webhook for AI analysis of the market
  const sendToAIAnalysis = async () => {
    try {
      setError(null);
      setIsAnalyzing(true);
      
      console.log('Sending data to n8n webhook for market analysis');
      
      // Preparar los datos a enviar
      const dataToSend = {
        futuresData: marketData,
        newsData: newsData,
        stocksData: stocksData,
        timestamp: new Date().toISOString(),
        dataSource: apiSource
      };
      
      try {
        // Make the request directly to the market analysis webhook
        const response = await axios.post(
          MARKET_ANALYSIS_WEBHOOK_URL,
          dataToSend
        );
        
        console.log('Market analysis response:', response.data);
        
        // Process the response
        if (response.data && typeof response.data === 'object') {
          if ('predictions' in response.data) {
            // Direct format
            setPredictionResults(response.data.predictions);
            setAnalysisSummary(response.data.summary || null);
            setAnalysisTimestamp(response.data.timestamp || new Date().toISOString());
            
            // Scroll to the analysis section
            setTimeout(() => {
              const marketAnalysisElement = document.getElementById('market-analysis');
              if (marketAnalysisElement) {
                marketAnalysisElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else if ('output' in response.data) {
            // Legacy format - still handle it just in case
            console.warn('Using legacy response format parsing');
            const outputText = response.data.output as string;
            
            try {
              // Buscar el objeto JSON entre comillas ```json y ```
              const jsonMatch = outputText.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                const predictions = JSON.parse(jsonMatch[1]);
                setPredictionResults(predictions);
                
                // Buscar el resumen después del JSON
                const summaryMatch = outputText.match(/```\s*([\s\S]*)/);
                if (summaryMatch && summaryMatch[1]) {
                  setAnalysisSummary(summaryMatch[1].trim());
                }
              } else {
                // Intentar buscar un objeto JSON sin los delimitadores ```
                const jsonRegex = /\{\s*"(\^[A-Z]+)"[\s\S]*?\}/;
                const match = outputText.match(jsonRegex);
                if (match) {
                  const startIndex = outputText.indexOf(match[0]);
                  const jsonText = extractValidJSON(outputText.substring(startIndex));
                  if (jsonText) {
                    setPredictionResults(JSON.parse(jsonText));
                    
                    // Extract summary from text after JSON
                    const textAfterJson = outputText.substring(startIndex + jsonText.length);
                    if (textAfterJson.trim()) {
                      setAnalysisSummary(textAfterJson.trim());
                    }
                  }
                }
              }
            } catch (parseError) {
              console.error('Error parsing AI output:', parseError);
              setError('Error al analizar la respuesta de IA. Formato inesperado.');
            }
          } else {
            console.warn('Unexpected response format:', response.data);
            setError('Formato de respuesta no reconocido');
          }
          
          // Guardar la marca de tiempo
          setAnalysisTimestamp(new Date().toISOString());
        } else {
          setError('Formato de respuesta no reconocido');
        }
        
        console.log('Data successfully sent to webhook');
      } catch (err) {
        console.error('Error sending data to AI analysis:', err);
        setError('Failed to get prediction results. Please try again later.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Market Prediction Dashboard</h1>
      
      {isLoading ? (
        <div className="text-center">Loading market data...</div>
      ) : (
        <>
          {apiError && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-red-300 mb-1"><strong>API Error:</strong> {apiError}</p>
                  <p className="text-red-300 text-sm">Using mock data for display purposes.</p>
                </div>
                <button 
                  onClick={() => setShowApiTester(true)}
                  className="px-3 py-1 bg-red-800 text-white text-sm rounded hover:bg-red-700"
                >
                  Test API
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-orange-900 border border-orange-700 rounded-lg">
              <p className="text-orange-300">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <MarketData title="Market Indices" data={marketData} />
            <MarketData title="Popular Stocks" data={stocksData} />
          </div>
          
          <NewsSection news={newsData} />
          
          <StockSearch onSearch={handleStockSearch} isSearching={isSearchingStock} />

          {stockSymbol && stockAnalysis && (
            <div id="stock-analysis" className="mb-8 scroll-mt-8">
              <StockAnalysis symbol={stockSymbol} prediction={stockAnalysis} />
            </div>
          )}
          
          <div id="market-analysis" className="mt-8 border border-gray-800 rounded-lg bg-gray-900 scroll-mt-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Análisis de Mercado</h2>
                <WebhookButton 
                  isLoading={isAnalyzing} 
                  onClick={sendToAIAnalysis} 
                  label="Ejecutar Análisis de IA"
                />
              </div>
              
              {predictionResults ? (
                <>
                  {analysisSummary && (
                    <MarketSummary
                      summaryText={analysisSummary}
                      timestamp={analysisTimestamp}
                    />
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(predictionResults).map(([index, prediction]) => (
                      <PredictionDetail 
                        key={index}
                        symbol={index}
                        prediction={prediction}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <p>No hay predicciones disponibles.</p>
                  <p className="text-sm mt-2">Haz clic en `Ejecutar Análisis de IA` para generar predicciones.</p>
                </div>
              )}
            </div>
          </div>

          {apiSource === 'mock' && (
            <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg flex justify-between items-center">
              <p className="text-yellow-300">
                <strong>Note:</strong> Currently using mock data. Configure your API keys in the .env.local file to fetch live data.
              </p>
              <button 
                onClick={() => setShowApiTester(true)}
                className="px-3 py-1 bg-yellow-800 text-white text-sm rounded hover:bg-yellow-700"
              >
                Test API
              </button>
            </div>
          )}
          
          {showApiTester && (
            <ApiTester onClose={() => setShowApiTester(false)} />
          )}
        </>
      )}
    </main>
  );
}