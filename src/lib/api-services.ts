// src/lib/api-services.ts
import axios from 'axios';
import { MarketDataItem, NewsItem } from '@/types/market';
import { mockMarketData, mockStocksData } from '@/mocks/testData';

// Símbolos populares como referencia rápida
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'FB'];
const MARKET_INDICES = ['^DJI', '^GSPC', '^IXIC', '^RUT'];

// Mapeo de símbolos comunes a símbolos compatibles con MarketStack
const symbolMapping: Record<string, string> = {
  // Usamos símbolos más convencionales que tienen más probabilidad de funcionar
  '^DJI': 'DIA',  // ETF del Dow Jones
  '^GSPC': 'SPY', // ETF del S&P 500
  '^IXIC': 'QQQ', // ETF del NASDAQ
  'ES=F': 'ES',   // S&P 500 E-mini futures (formato simplificado)
  'YM=F': 'YM',   // Dow Jones E-mini futures (formato simplificado)
  'NQ=F': 'NQ'    // NASDAQ E-mini futures (formato simplificado)
};

// MarketStack API service
export const marketStackService = {
  // Cache simple para reducir llamadas API
  dataCache: {} as Record<string, {data: MarketDataItem, timestamp: number}>,
  CACHE_TTL: 15 * 60 * 1000, // 15 minutos en milisegundos

  // Convierte el símbolo al formato que acepta MarketStack
  convertSymbol(symbol: string): string {
    return symbolMapping[symbol] || symbol;
  },
  
  // Obtener datos para un solo símbolo
  async getStockData(symbol: string): Promise<MarketDataItem | null> {
    try {
      const data = await this.getEndOfDayData([symbol]);
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Failed to fetch data for ${symbol}:`, error);
      
      // Buscar en datos simulados
      const mockData = mockStocksData.find(item => item.symbol === symbol) || 
                      mockMarketData.find(item => item.symbol === symbol);
                      
      // Si no hay datos simulados para este símbolo, crear uno básico
      if (!mockData) {
        return {
          symbol,
          open: 100,
          close: 102,
          high: 103,
          low: 99,
          volume: 1000000,
          date: new Date().toISOString()
        };
      }
      
      return mockData;
    }
  },
  
  async getEndOfDayData(symbols: string[]): Promise<MarketDataItem[]> {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY;
      
      if (!API_KEY) {
        throw new Error('MarketStack API key is not configured');
      }
      
      const results: MarketDataItem[] = [];
      const symbolsToFetch: string[] = [];
      
      // Revisar caché primero
      for (const symbol of symbols) {
        const cached = this.dataCache[symbol];
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
          console.log(`Using cached data for ${symbol}`);
          results.push(cached.data);
        } else {
          symbolsToFetch.push(symbol);
        }
      }
      
      // Si no hay símbolos para buscar, devolvemos los resultados de la caché
      if (symbolsToFetch.length === 0) {
        return results;
      }
      
      // Convertir símbolos al formato de MarketStack
      const convertedSymbols = symbolsToFetch.map(s => this.convertSymbol(s));
      console.log('Fetching EOD data for symbols:', convertedSymbols);
      
      // Hacemos solicitudes individuales para cada símbolo para evitar problemas
      const errors: string[] = [];
      
      for (const symbol of convertedSymbols) {
        try {
          const response = await axios.get(
            `https://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${symbol}&limit=1`
          );
          
          if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            // Agregamos el símbolo original para mantener consistencia
            const originalSymbol = Object.keys(symbolMapping).find(key => symbolMapping[key] === symbol) || symbol;
            const data = response.data.data[0];
            data.symbol = originalSymbol;
            
            // Actualizar caché
            this.dataCache[originalSymbol] = {
              data,
              timestamp: Date.now()
            };
            
            results.push(data);
          } else {
            errors.push(`No data returned for symbol ${symbol}`);
          }
        } catch (error) {
          console.warn(`Unable to fetch data for symbol ${symbol}:`, error);
          errors.push(`Failed to fetch data for ${symbol}`);
          // Continuamos con el siguiente símbolo
        }
      }
      
      console.log(`Successfully fetched ${results.length} symbols, failed for ${errors.length} symbols`);
      
      // Si no pudimos obtener ningún dato y no hay resultados de caché
      if (results.length === 0) {
        console.warn('No data available for any requested symbols, using mock data');
        // Devolver datos simulados para estos símbolos específicos
        return symbols.map(symbol => {
          // Buscar en los datos simulados por símbolo
          const mockData = mockMarketData.find(item => item.symbol === symbol) || 
                          mockStocksData.find(item => item.symbol === symbol);
          
          if (mockData) {
            return mockData;
          }
          
          // Si no encontramos el símbolo en los datos simulados, crear uno básico
          return {
            symbol,
            open: 100,
            close: 102,
            high: 103,
            low: 99,
            volume: 1000000,
            date: new Date().toISOString()
          };
        });
      }
      
      return results;
    } catch (error) {
      // Mostramos información específica del error para ayudar a diagnosticar
      if (axios.isAxiosError(error)) {
        // Para errores de Axios, mostramos el código de estado y los detalles
        const statusCode = error.response?.status;
        console.error(`MarketStack API error (${statusCode}):`, error.message);
        
        if (statusCode === 401) {
          console.error('Authentication failed. Please check your API key.');
        } else if (statusCode === 422) {
          console.error('Invalid request. The symbols may not be supported or formatted correctly.');
        } else if (statusCode === 429) {
          console.error('Rate limit exceeded. Please try again later or upgrade your plan.');
        }
      } else if (error instanceof Error) {
        console.error('Error fetching market data:', error.message);
      } else {
        console.error('Unknown error fetching market data');
      }
      
      // En caso de error, devolvemos datos simulados para los símbolos solicitados
      return symbols.map(symbol => {
        const mockData = mockMarketData.find(item => item.symbol === symbol) || 
                        mockStocksData.find(item => item.symbol === symbol);
        
        if (mockData) {
          return mockData;
        }
        
        return {
          symbol,
          open: 100,
          close: 102,
          high: 103,
          low: 99,
          volume: 1000000,
          date: new Date().toISOString()
        };
      });
    }
  },
  
  // Obtener acciones populares con opción para personalizar
  async getPopularStocks(customSymbols?: string[]): Promise<MarketDataItem[]> {
    const symbolsToFetch = customSymbols || POPULAR_STOCKS;
    try {
      return await this.getEndOfDayData(symbolsToFetch);
    } catch (error) {
      console.error('Failed to fetch popular stocks:', error);
      // En caso de error, filtrar datos simulados para los símbolos solicitados
      return mockStocksData.filter(stock => symbolsToFetch.includes(stock.symbol));
    }
  },
  
  // Método específico para índices de mercado
  async getMarketIndices(customIndices?: string[]): Promise<MarketDataItem[]> {
    const indicesToFetch = customIndices || MARKET_INDICES;
    try {
      return await this.getEndOfDayData(indicesToFetch);
    } catch (error) {
      console.error('Failed to fetch market indices:', error);
      // En caso de error, filtrar datos simulados para los índices solicitados
      return mockMarketData.filter(index => indicesToFetch.includes(index.symbol));
    }
  }
};

// Alpha Vantage News API service
export const newsService = {
  async getFinancialNews(): Promise<NewsItem[]> {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
      
      if (!API_KEY) {
        throw new Error('Alpha Vantage API key is not configured');
      }
      
      console.log('Fetching financial news from Alpha Vantage');
      
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${API_KEY}`
      );
      
      // Log para depuración
      console.log('Alpha Vantage response structure:', Object.keys(response.data));
      
      // Alpha Vantage returns a different format than our NewsItem interface
      if (response.data && response.data.feed && Array.isArray(response.data.feed)) {
        console.log(`Received ${response.data.feed.length} news items from Alpha Vantage`);
        
        return response.data.feed.slice(0, 10).map((item: unknown) => {
          // Log para depuración de estructura
          if (item && typeof item === 'object' && Object.keys(item).length > 0) {
            console.log('News item structure:', Object.keys(item));
          }
          
          return {
            title: item.title || 'No Title',
            summary: item.summary || 'No Description',
            url: item.url || '',
            source: item.source || 'Alpha Vantage',
            timestamp: item.time_published || new Date().toISOString(),
            // Optional fields
            sentiment: item.overall_sentiment_label || null,
            image: (item.banner_image && item.banner_image !== 'null') ? item.banner_image : null
          };
        });
      }
      
      console.warn('Invalid or empty response format from Alpha Vantage API:', response.data);
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        console.error(`Alpha Vantage API error (${statusCode}):`, error.message);
        console.error('Response data:', error.response?.data);
      } else if (error instanceof Error) {
        console.error('Error fetching financial news:', error.message);
      } else {
        console.error('Unknown error fetching financial news');
      }
      
      throw error;
    }
  }
};

// Alternative: NewsAPI service
export const newsAPIService = {
  async getFinancialNews(): Promise<NewsItem[]> {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
      
      if (!API_KEY) {
        throw new Error('NewsAPI key is not configured');
      }
      
      console.log('Fetching news from NewsAPI');
      
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${API_KEY}`
      );
      
      // Log para depuración
      console.log('NewsAPI response structure:', Object.keys(response.data));
      
      if (response.data && response.data.articles && Array.isArray(response.data.articles)) {
        console.log(`Received ${response.data.articles.length} news items from NewsAPI`);
        
        return response.data.articles.map((item: unknown) => {
          // Log para depuración de estructura
          if (item && typeof item === 'object' && Object.keys(item).length > 0) {
            console.log('News item structure:', Object.keys(item));
          }
          
          let source = 'Unknown';
          if (item.source && typeof item.source === 'object' && item.source.name) {
            source = item.source.name;
          } else if (typeof item.source === 'string') {
            source = item.source;
          }
          
          return {
            title: item.title || 'No Title',
            summary: item.description || 'No Description',
            url: item.url || '',
            source: source,
            timestamp: item.publishedAt || new Date().toISOString(),
            image: (item.urlToImage && item.urlToImage !== 'null') ? item.urlToImage : null
          };
        });
      }
      
      console.warn('Invalid or empty response format from NewsAPI:', response.data);
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        console.error(`NewsAPI error (${statusCode}):`, error.message);
        console.error('Response data:', error.response?.data);
      } else if (error instanceof Error) {
        console.error('Error fetching news from NewsAPI:', error.message);
      } else {
        console.error('Unknown error fetching news');
      }
      
      throw error;
    }
  }
};