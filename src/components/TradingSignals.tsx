import React from 'react';
import { ArrowUp, ArrowDown, Minus, Clock, Target, TrendingUp } from 'lucide-react';

interface Signal {
  id: string;
  timestamp: Date;
  pair: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  confidence: number;
  reason: string;
  aiModel: string;
}

interface TradingSignalsProps {
  signals: Signal[];
  theme: string;
}

const TradingSignals: React.FC<TradingSignalsProps> = ({ signals, theme }) => {
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'SELL':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'SELL':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getDarkSignalColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'text-green-400 bg-green-900/20 border-green-700';
      case 'SELL':
        return 'text-red-400 bg-red-900/20 border-red-700';
      default:
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
    }
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI 交易信号</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
          }`}>
            {signals.length} 个活跃信号
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {signals.length === 0 ? (
            <div className="text-center py-8 opacity-70">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p>暂无交易信号</p>
              <p className="text-sm mt-1">输入策略需求以生成AI分析</p>
            </div>
          ) : (
            signals.map((signal) => (
              <div
                key={signal.id}
                className={`p-4 rounded-lg border transition-colors ${
                  theme === 'dark' ? getDarkSignalColor(signal.type) : getSignalColor(signal.type)
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {getSignalIcon(signal.type)}
                    <div>
                      <div className="font-semibold text-sm">{signal.pair}</div>
                      <div className="text-xs opacity-70 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{signal.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold">${signal.price.toLocaleString()}</div>
                    <div className="text-xs opacity-70">
                      置信度: {signal.confidence}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm opacity-80">{signal.reason}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {signal.aiModel}
                    </span>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${
                      signal.type === 'BUY' ? 'bg-green-600 text-white' :
                      signal.type === 'SELL' ? 'bg-red-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {signal.type}
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

export default TradingSignals;