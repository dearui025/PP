import { useState, useEffect } from 'react';
import { marketDataService, CryptoPrice } from '../services/marketApi';

interface MarketData {
  prices: Record<string, CryptoPrice>;
  lastUpdate: number;
}

export const useTradingData = (symbols: string[] = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT', 'DOT/USDT']) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    // 初始化获取价格数据
    const initializeData = async () => {
      try {
        const prices = await marketDataService.getPrices(symbols);
        if (mounted) {
          const pricesMap: Record<string, CryptoPrice> = {};
          prices.forEach(price => {
            pricesMap[price.symbol] = price;
          });
          
          setMarketData({
            prices: pricesMap,
            lastUpdate: Date.now()
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('获取市场数据失败');
          setIsLoading(false);
          console.error('Market data error:', err);
        }
      }
    };

    initializeData();

    // 设置WebSocket订阅
    const subscriptions: (() => void)[] = [];
    
    symbols.forEach(symbol => {
      marketDataService.subscribeToPrice(symbol, (priceData) => {
        if (mounted) {
          setMarketData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              prices: {
                ...prev.prices,
                [symbol]: priceData
              },
              lastUpdate: Date.now()
            };
          });
        }
      });
      
      subscriptions.push(() => marketDataService.unsubscribeFromPrice(symbol));
    });

    // 定期刷新数据（备用方案）
    const refreshInterval = setInterval(() => {
      if (mounted) {
        initializeData();
      }
    }, 30000); // 每30秒刷新一次

    return () => {
      mounted = false;
      subscriptions.forEach(unsubscribe => unsubscribe());
      clearInterval(refreshInterval);
    };
  }, [symbols.join(',')]);

  return { marketData, isLoading, error };
};