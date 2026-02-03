import React from 'react';
import { Stock } from '../types';

interface StockListProps {
  stocks: Stock[];
  onAddToWatchlist: (symbol: string) => void;
}

export const StockList: React.FC<StockListProps> = ({ stocks, onAddToWatchlist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => {
              const isPositive = stock.change_percent > 0;
              const isNegative = stock.change_percent < 0;
              
              return (
                <tr key={stock.symbol}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${stock.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.change_percent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onAddToWatchlist(stock.symbol)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Add to Watchlist
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
