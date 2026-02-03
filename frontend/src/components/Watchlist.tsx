import React from 'react';
import { WatchlistItem } from '../types';
import { StockCard } from './StockCard';

interface WatchlistProps {
  items: WatchlistItem[];
  onRemove: (symbol: string) => void;
  onAnalyze: (symbol: string) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ items, onRemove, onAnalyze }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Watchlist</h2>
        <p className="text-gray-600">No stocks in your watchlist yet. Add stocks from the list below.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <StockCard
            key={item.symbol}
            stock={item}
            onRemove={onRemove}
            onAnalyze={onAnalyze}
          />
        ))}
      </div>
    </div>
  );
};
