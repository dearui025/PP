import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { CryptoPrice } from '../services/marketApi';

interface MarketDataProps {
  marketData: {
    prices: Record<string, CryptoPrice>;
    lastUpdate: number;
  } | null;
  selectedPair: string;
  onPairSelect: (pair: string) => void;
  theme: string;
  isLoading?: boolean;
  error?: string | null;
}

const MarketData: React.FC<MarketDataProps> = ({ 
  marketData, 
  selectedPair, 
  onPairSelect, 
  theme, 
  isLoading = false, 
  error = null 
}) => {
  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(2);
  };

  const cryptoPairs = marketData ? Object.values(marketData.prices) : [];

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">实时行情 {isLoading && <span className="text-xs opacity-50">加载中...</span>}</h3>
        </div>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          {cryptoPairs.length === 0 && !isLoading ? (
            <div className="text-center py-8 opacity-70">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p>暂无行情数据</p>
            </div>
          ) : (
            cryptoPairs.map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => onPairSelect(pair.symbol)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedPair === pair.symbol
                  ? theme === 'dark' ? 'bg-gray-700 border border-blue-500' : 'bg-blue-50 border border-blue-200'
                  : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">{pair.symbol}</div>
                  <div className="text-xs opacity-70">Vol: {formatVolume(pair.volume24h)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${pair.price < 1 ? pair.price.toFixed(4) : pair.price.toLocaleString()}
                  </div>
                  <div className={`flex items-center justify-end space-x-1 text-xs ${
                    pair.changePercent24h > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {pair.changePercent24h > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{pair.changePercent24h > 0 ? '+' : ''}{pair.changePercent24h.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketData;