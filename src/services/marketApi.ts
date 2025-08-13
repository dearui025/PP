// 市场数据API服务
export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  lastUpdate: number;
}

export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketDataService {
  private baseUrl = 'https://api.binance.com/api/v3';
  private wsUrl = 'wss://stream.binance.com:9443/ws';
  private ws: WebSocket | null = null;
  private subscribers: Map<string, (data: CryptoPrice) => void> = new Map();

  // 获取单个交易对价格
  async getPrice(symbol: string): Promise<CryptoPrice> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol.replace('/', '')}`);
      const data = await response.json();
      
      return {
        symbol: symbol,
        price: parseFloat(data.lastPrice),
        change24h: parseFloat(data.priceChange),
        changePercent24h: parseFloat(data.priceChangePercent),
        volume24h: parseFloat(data.volume),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        lastUpdate: Date.now()
      };
    } catch (error) {
      console.error('获取价格失败:', error);
      throw error;
    }
  }

  // 获取多个交易对价格
  async getPrices(symbols: string[]): Promise<CryptoPrice[]> {
    try {
      const symbolsParam = symbols.map(s => `"${s.replace('/', '')}"`).join(',');
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbols=[${symbolsParam}]`);
      const data = await response.json();
      
      return data.map((item: any) => ({
        symbol: this.formatSymbol(item.symbol),
        price: parseFloat(item.lastPrice),
        change24h: parseFloat(item.priceChange),
        changePercent24h: parseFloat(item.priceChangePercent),
        volume24h: parseFloat(item.volume),
        high24h: parseFloat(item.highPrice),
        low24h: parseFloat(item.lowPrice),
        lastUpdate: Date.now()
      }));
    } catch (error) {
      console.error('获取多个价格失败:', error);
      throw error;
    }
  }

  // 获取K线数据
  async getKlineData(symbol: string, interval: string = '1h', limit: number = 100): Promise<KlineData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol.replace('/', '')}&interval=${interval}&limit=${limit}`
      );
      const data = await response.json();
      
      return data.map((kline: any[]) => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));
    } catch (error) {
      console.error('获取K线数据失败:', error);
      throw error;
    }
  }

  // WebSocket实时价格订阅
  subscribeToPrice(symbol: string, callback: (data: CryptoPrice) => void) {
    const streamName = `${symbol.replace('/', '').toLowerCase()}@ticker`;
    this.subscribers.set(symbol, callback);

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connectWebSocket();
    }

    // 订阅新的交易对
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [streamName],
        id: Date.now()
      }));
    }
  }

  // 取消订阅
  unsubscribeFromPrice(symbol: string) {
    const streamName = `${symbol.replace('/', '').toLowerCase()}@ticker`;
    this.subscribers.delete(symbol);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: 'UNSUBSCRIBE',
        params: [streamName],
        id: Date.now()
      }));
    }
  }

  // 连接WebSocket
  private connectWebSocket() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.e === '24hrTicker') {
          const symbol = this.formatSymbol(data.s);
          const callback = this.subscribers.get(symbol);
          
          if (callback) {
            const priceData: CryptoPrice = {
              symbol: symbol,
              price: parseFloat(data.c),
              change24h: parseFloat(data.P),
              changePercent24h: parseFloat(data.P),
              volume24h: parseFloat(data.v),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
              lastUpdate: Date.now()
            };
            callback(priceData);
          }
        }
      } catch (error) {
        console.error('WebSocket消息解析失败:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket连接已关闭');
      // 5秒后重连
      setTimeout(() => {
        if (this.subscribers.size > 0) {
          this.connectWebSocket();
        }
      }, 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  }

  // 格式化交易对符号
  private formatSymbol(symbol: string): string {
    // 将BTCUSDT转换为BTC/USDT
    if (symbol.endsWith('USDT')) {
      const base = symbol.slice(0, -4);
      return `${base}/USDT`;
    }
    return symbol;
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

export const marketDataService = new MarketDataService();