import { interval, Observable, map, Subject } from 'rxjs';
import { Stock, WatchlistItem } from '../types';

// 模拟实时股价更新服务
export class RealtimeStockService {
  private updateSubject = new Subject<{ symbol: string; price: number; change: number; change_percent: number }>();
  private stocks: Stock[] = [];

  // 初始化服务
  init(stocks: Stock[]) {
    this.stocks = stocks;
    // 每2秒模拟一次股价更新
    interval(2000).subscribe(() => {
      this.simulatePriceUpdates();
    });
  }

  // 模拟股价更新
  private simulatePriceUpdates() {
    this.stocks.forEach(stock => {
      // 生成随机价格变化（-0.5% 到 +0.5%）
      const changePercent = (Math.random() - 0.5) * 0.01;
      const oldPrice = stock.price;
      const newPrice = oldPrice * (1 + changePercent);
      const change = newPrice - oldPrice;

      // 更新股票数据
      stock.price = newPrice;
      stock.change = change;
      stock.change_percent = changePercent * 100;
      stock.last_updated = new Date().toISOString();

      // 发送更新通知
      this.updateSubject.next({
        symbol: stock.symbol,
        price: newPrice,
        change,
        change_percent: changePercent * 100
      });
    });
  }

  // 获取实时股价更新的Observable
  getPriceUpdates(): Observable<{ symbol: string; price: number; change: number; change_percent: number }> {
    return this.updateSubject.asObservable();
  }

  // 更新自选股列表中的价格
  updateWatchlistPrices(watchlist: WatchlistItem[]): WatchlistItem[] {
    return watchlist.map(item => {
      const stock = this.stocks.find(s => s.symbol === item.symbol);
      if (stock) {
        return {
          ...item,
          price: stock.price,
          change: stock.change,
          change_percent: stock.change_percent
        };
      }
      return item;
    });
  }
}

// 导出单例实例
export const realtimeStockService = new RealtimeStockService();
