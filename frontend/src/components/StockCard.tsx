import React from 'react';
import { WatchlistItem } from '../types';

interface StockCardProps {
  stock: WatchlistItem;
  onRemove?: (symbol: string) => void;
  onAnalyze?: (symbol: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onRemove, onAnalyze }) => {
  const isPositive = stock.change_percent > 0;
  const isNegative = stock.change_percent < 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.change_percent.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {onAnalyze && (
          <button
            onClick={() => onAnalyze(stock.symbol)}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
          >
            Analyze
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(stock.symbol)}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
