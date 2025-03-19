// src/components/NewsSection.tsx
import React from 'react';
import { NewsItem } from '@/types/market';

interface NewsSectionProps {
  news: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  // Función para formatear fecha a formato legible
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return timestamp;
    }
  };

  // Extraer el nombre del dominio de la URL para usar como fallback source
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return 'news source';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Market News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagen de la noticia si está disponible */}
              {item.image && (
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-3">{item.summary}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                  <span className="font-medium">{item.source || getDomainFromUrl(item.url)}</span>
                  <span>{formatDate(item.timestamp)}</span>
                </div>
                
                {/* Indicador de sentimiento si está disponible */}
                {item.sentiment && (
                  <div className={`
                    text-xs mt-2 py-1 px-2 rounded-full inline-block
                    ${item.sentiment === 'positive' || item.sentiment === 'Bullish' ? 'bg-green-900 text-green-300' : 
                      item.sentiment === 'negative' || item.sentiment === 'Bearish' ? 'bg-red-900 text-red-300' : 
                      'bg-gray-800 text-gray-300'}
                  `}>
                    {item.sentiment}
                  </div>
                )}
                
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 text-blue-400 hover:text-blue-300 hover:underline text-sm block"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No news available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default NewsSection;