import { Stock, WatchlistItem, StockAnalysis } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const api = {
  // 获取所有股票
  async getStocks(): Promise<Stock[]> {
    const response = await fetch(`${API_BASE_URL}/api/stocks`);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks');
    }
    return response.json();
  },

  // 获取单个股票详情
  async getStockBySymbol(symbol: string): Promise<Stock> {
    const response = await fetch(`${API_BASE_URL}/api/stocks/${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock ${symbol}`);
    }
    return response.json();
  },

  // 获取股票分析
  async getStockAnalysis(symbol: string): Promise<StockAnalysis> {
    const response = await fetch(`${API_BASE_URL}/api/stocks/${symbol}/analysis`);
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis for ${symbol}`);
    }
    return response.json();
  },

  // 获取用户自选股
  async getUserWatchlist(userId: number): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/user/watchlist?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist');
    }
    return response.json();
  },

  // 添加股票到自选
  async addToWatchlist(userId: number, symbol: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/user/watchlist/add?user_id=${userId}&symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to add ${symbol} to watchlist`);
    }
    return response.json();
  },

  // 从自选中移除股票
  async removeFromWatchlist(userId: number, symbol: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/user/watchlist/remove?user_id=${userId}&symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to remove ${symbol} from watchlist`);
    }
    return response.json();
  },
};
