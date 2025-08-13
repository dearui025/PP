import React from 'react';
import { Brain, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface AIAnalysisProps {
  signals: any[];
  theme: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ signals, theme }) => {
  const analysisData = {
    lstm: {
      prediction: 'BULLISH',
      confidence: 78.5,
      nextPrice: 46890.50,
      timeframe: '24h'
    },
    technicals: {
      rsi: { value: 42.3, signal: 'NEUTRAL', description: 'RSI在中性区间，无明显超买超卖' },
      macd: { value: 156.78, signal: 'BULLISH', description: 'MACD金叉形成，看涨信号' },
      ma: { value: 45234.56, signal: 'BULLISH', description: '价格突破20日均线，趋势向上' }
    },
    marketSentiment: {
      score: 0.65,
      level: 'POSITIVE',
      factors: ['技术面积极', '成交量增加', '突破关键阻力位']
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
      case 'POSITIVE':
        return 'text-green-500';
      case 'BEARISH':
      case 'NEGATIVE':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
      case 'POSITIVE':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'BEARISH':
      case 'NEGATIVE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI 智能分析</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* LSTM Prediction */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>LSTM 价格预测</span>
            </h4>
            <div className={`text-sm font-bold ${getSignalColor(analysisData.lstm.prediction)}`}>
              {analysisData.lstm.prediction}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="opacity-70">预测价格</div>
              <div className="font-bold">${analysisData.lstm.nextPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="opacity-70">置信度</div>
              <div className="font-bold">{analysisData.lstm.confidence}%</div>
            </div>
            <div>
              <div className="opacity-70">时间范围</div>
              <div className="font-bold">{analysisData.lstm.timeframe}</div>
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div>
          <h4 className="text-sm font-semibold mb-3">技术指标分析</h4>
          <div className="space-y-3">
            {Object.entries(analysisData.technicals).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getSignalIcon(data.signal)}
                  <div>
                    <div className="text-sm font-semibold uppercase">{key}</div>
                    <div className="text-xs opacity-70">{data.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{data.value.toFixed(2)}</div>
                  <div className={`text-xs font-semibold ${getSignalColor(data.signal)}`}>
                    {data.signal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">市场情绪分析</h4>
            <div className={`text-sm font-bold ${getSignalColor(analysisData.marketSentiment.level)}`}>
              {analysisData.marketSentiment.level}
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>情绪指数</span>
              <span className="font-bold">{(analysisData.marketSentiment.score * 100).toFixed(1)}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${analysisData.marketSentiment.score * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-1">
            {analysisData.marketSentiment.factors.map((factor, index) => (
              <div key={index} className="text-xs opacity-80 flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;