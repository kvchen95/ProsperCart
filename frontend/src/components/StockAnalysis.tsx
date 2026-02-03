import React from 'react';
import { StockAnalysis as StockAnalysisType } from '../types';

interface StockAnalysisProps {
  analysis: StockAnalysisType | null;
  onClose: () => void;
}

export const StockAnalysis: React.FC<StockAnalysisProps> = ({ analysis, onClose }) => {
  if (!analysis) {
    return null;
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{analysis.symbol} Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-gray-700">{analysis.analysis}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fundamentals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">P/E Ratio</p>
                <p className="text-lg font-semibold text-gray-900">{analysis.fundamentals.pe_ratio}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">EPS</p>
                <p className="text-lg font-semibold text-gray-900">${analysis.fundamentals.eps}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Revenue Growth</p>
                <p className="text-lg font-semibold text-gray-900">{analysis.fundamentals.revenue_growth}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-lg font-semibold text-gray-900">{analysis.fundamentals.profit_margin}%</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sentiment</h3>
            <p className={`text-lg font-medium ${getSentimentColor(analysis.sentiment)}`}>
              {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
