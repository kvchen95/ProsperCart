export interface Stock {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap?: number;
  sector?: string;
  last_updated: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
}

export interface StockAnalysis {
  symbol: string;
  analysis: string;
  fundamentals: {
    pe_ratio: number;
    eps: number;
    revenue_growth: number;
    profit_margin: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
}
