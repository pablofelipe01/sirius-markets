// src/components/StockTicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MarketDataItem } from '@/types/market';

interface StockTickerProps {
  stocks: MarketDataItem[];
}

const StockTicker: React.FC<StockTickerProps> = ({ stocks }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1); // 1 = normal, 2 = fast, 0.5 = slow

  useEffect(() => {
    if (!scrollRef.current || stocks.length === 0) return;
    
    // Duplicar el contenido para crear un efecto de desplazamiento infinito
    const scrollContent = scrollRef.current;
    scrollContent.innerHTML = ''; // Clear existing content
    
    // Add original items
    stocks.forEach(stock => {
      const element = createStockElement(stock);
      scrollContent.appendChild(element);
    });
    
    // Clone for infinite effect
    const cloneElements = Array.from(scrollContent.children).map(child => 
      child.cloneNode(true)
    );
    
    cloneElements.forEach(node => {
      scrollContent.appendChild(node);
    });
    
    // Iniciar la animación
    const scrollWidth = scrollContent.scrollWidth / 2;
    
    let animationFrameId: number;
    let currentPos = 0;
    
    const animate = () => {
      if (!isPaused) {
        currentPos -= speed; // Velocidad ajustable
        
        // Reiniciar la posición cuando llegue a la mitad
        if (currentPos <= -scrollWidth) {
          currentPos = 0;
        }
        
        scrollContent.style.transform = `translateX(${currentPos}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Limpiar
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stocks, isPaused, speed]);

  // Crear elemento de stock con todos los detalles
  const createStockElement = (stock: MarketDataItem) => {
    const change = stock.close - stock.open;
    const percentChange = (change / stock.open * 100);
    
    const stockElement = document.createElement('div');
    stockElement.className = 'flex items-center space-x-2 px-4';
    
    const symbol = document.createElement('span');
    symbol.className = 'font-bold';
    symbol.textContent = stock.symbol;
    
    const price = document.createElement('span');
    price.className = 'text-gray-300';
    price.textContent = `$${stock.close.toFixed(2)}`;
    
    const changeElement = document.createElement('span');
    changeElement.className = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400';
    
    const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '■';
    const sign = change > 0 ? '+' : '';
    changeElement.textContent = `${arrow} ${sign}${change.toFixed(2)} (${sign}${percentChange.toFixed(2)}%)`;
    
    stockElement.appendChild(symbol);
    stockElement.appendChild(price);
    stockElement.appendChild(changeElement);
    
    return stockElement;
  };

  // Cambiar velocidad
  const changeSpeed = () => {
    if (speed === 1) setSpeed(2);
    else if (speed === 2) setSpeed(0.5);
    else setSpeed(1);
  };

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 overflow-hidden py-2">
      <div className="flex items-center">
        <div className="bg-blue-600 px-3 py-1 text-white font-semibold rounded-l flex items-center">
          <span className="mr-2">LIVE</span>
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="text-xs bg-blue-700 hover:bg-blue-800 rounded px-1"
            title={isPaused ? "Reanudar" : "Pausar"}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>
        <button 
          onClick={changeSpeed} 
          className="bg-gray-800 px-2 py-1 text-xs text-white rounded-r hover:bg-gray-700"
          title="Cambiar velocidad"
        >
          {speed === 0.5 ? 'Slow' : speed === 1 ? 'Normal' : 'Fast'}
        </button>
        <div className="overflow-hidden ml-4 flex-1">
          <div ref={scrollRef} className="flex space-x-8 whitespace-nowrap"></div>
        </div>
      </div>
    </div>
  );
};

export default StockTicker;