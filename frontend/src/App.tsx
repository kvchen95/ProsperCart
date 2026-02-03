import React, { useState, useEffect } from 'react';
import './App.css';
import { StockList } from './components/StockList';
import { Watchlist } from './components/Watchlist';
import { StockAnalysis } from './components/StockAnalysis';
import { api } from './services/api';
import { realtimeStockService } from './services/realtime.service';
import { Stock, WatchlistItem, StockAnalysis as StockAnalysisType } from './types';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<StockAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = 1; // 模拟用户ID

  // 加载所有股票
  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      try {
        // 由于后端可能尚未完全实现，这里使用模拟数据
        const mockStocks: Stock[] = [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 187.56, change: 1.23, change_percent: 0.66, market_cap: 2.92e12, sector: 'Technology', last_updated: new Date().toISOString() },
          { id: 2, symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.34, change: -2.15, change_percent: -0.52, market_cap: 3.1e12, sector: 'Technology', last_updated: new Date().toISOString() },
          { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 137.45, change: 0.87, change_percent: 0.64, market_cap: 1.8e12, sector: 'Technology', last_updated: new Date().toISOString() },
          { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.92, change: 1.56, change_percent: 0.88, market_cap: 1.83e12, sector: 'Consumer Cyclical', last_updated: new Date().toISOString() },
          { id: 5, symbol: 'TSLA', name: 'Tesla, Inc.', price: 213.45, change: -3.21, change_percent: -1.48, market_cap: 668e9, sector: 'Consumer Cyclical', last_updated: new Date().toISOString() },
        ];
        setStocks(mockStocks);
        // 初始化实时股价服务
        realtimeStockService.init(mockStocks);
      } catch (err) {
        setError('Failed to load stocks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  // 订阅实时股价更新
  useEffect(() => {
    const subscription = realtimeStockService.getPriceUpdates().subscribe(update => {
      // 更新股票列表中的价格
      setStocks(prev => prev.map(stock => {
        if (stock.symbol === update.symbol) {
          return {
            ...stock,
            price: update.price,
            change: update.change,
            change_percent: update.change_percent,
            last_updated: new Date().toISOString()
          };
        }
        return stock;
      }));
      
      // 更新自选股列表中的价格
      setWatchlist(prev => prev.map(item => {
        if (item.symbol === update.symbol) {
          return {
            ...item,
            price: update.price,
            change: update.change,
            change_percent: update.change_percent
          };
        }
        return item;
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  // 加载自选股
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        // 模拟自选股数据
        const mockWatchlist: WatchlistItem[] = [
          { symbol: 'AAPL', name: 'Apple Inc.', price: 187.56, change: 1.23, change_percent: 0.66 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.34, change: -2.15, change_percent: -0.52 },
        ];
        setWatchlist(mockWatchlist);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      }
    };

    loadWatchlist();
  }, []);

  // 添加股票到自选
  const handleAddToWatchlist = async (symbol: string) => {
    try {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock && !watchlist.some(item => item.symbol === symbol)) {
        const newItem: WatchlistItem = {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          change_percent: stock.change_percent
        };
        setWatchlist(prev => [...prev, newItem]);
      }
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  // 从自选中移除股票
  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  // 分析股票
  const handleAnalyzeStock = async (symbol: string) => {
    try {
      // 调用后端API获取分析结果
      const analysis = await api.getStockAnalysis(symbol);
      setSelectedAnalysis(analysis);
    } catch (err) {
      console.error('Failed to analyze stock:', err);
      // 失败时使用模拟数据
      const mockAnalysis: StockAnalysisType = {
        symbol,
        analysis: `This is a detailed analysis of ${symbol}. The stock shows strong fundamentals with consistent revenue growth and healthy profit margins. Technical indicators suggest a positive outlook for the near term.`,
        fundamentals: {
          pe_ratio: 25.5,
          eps: 4.2,
          revenue_growth: 15.2,
          profit_margin: 12.8
        },
        sentiment: 'positive'
      };
      setSelectedAnalysis(mockAnalysis);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Stock Analysis Platform
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* 自选股部分 */}
          <div className="mb-8">
            <Watchlist
              items={watchlist}
              onRemove={handleRemoveFromWatchlist}
              onAnalyze={handleAnalyzeStock}
            />
          </div>

          {/* 所有股票部分 */}
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading stocks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <StockList
                stocks={stocks}
                onAddToWatchlist={handleAddToWatchlist}
              />
            )}
          </div>
        </div>
      </main>

      {/* 分析弹窗 */}
      <StockAnalysis
        analysis={selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
      />
    </div>
  );
}

export default App;