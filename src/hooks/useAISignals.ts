import { useState, useCallback } from 'react';

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

export const useAISignals = () => {
  const [signals, setSignals] = useState<Signal[]>([]);

  const generateSignal = useCallback((input: string, pair: string) => {
    // Simulate AI analysis based on input
    const analysisTypes = {
      'rsi': { type: 'HOLD', reason: 'RSI指标显示市场处于中性区间，建议观望等待更好机会', confidence: 75 },
      'macd': { type: 'BUY', reason: 'MACD金叉形成，动量指标转为积极，建议逢低买入', confidence: 82 },
      '趋势': { type: 'BUY', reason: '技术面显示上涨趋势确立，价格突破关键阻力位', confidence: 88 },
      '量子': { type: 'SELL', reason: '量子随机算法检测到市场异常波动，建议部分获利了结', confidence: 70 },
      '默认': { type: 'BUY', reason: 'LSTM神经网络预测价格将在24小时内上涨，建议分批买入', confidence: 79 }
    };

    let signalData = analysisTypes['默认'];
    
    // Simple keyword matching for demo
    Object.keys(analysisTypes).forEach(keyword => {
      if (input.toLowerCase().includes(keyword.toLowerCase())) {
        signalData = analysisTypes[keyword];
      }
    });

    const models = ['LSTM-v2.1', 'DeepSeek-Trading', 'Zhipu-Quant', 'Quantum-AI'];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    
    const basePrice = pair === 'BTC/USDT' ? 45000 : 
                     pair === 'ETH/USDT' ? 2200 : 
                     pair === 'BNB/USDT' ? 310 : 0.5;
    
    const newSignal: Signal = {
      id: Date.now().toString(),
      timestamp: new Date(),
      pair: pair,
      type: signalData.type,
      price: basePrice * (1 + (Math.random() - 0.5) * 0.05),
      confidence: signalData.confidence + Math.floor(Math.random() * 10 - 5),
      reason: signalData.reason,
      aiModel: randomModel
    };

    setSignals(prev => [newSignal, ...prev.slice(0, 9)]); // Keep last 10 signals
  }, []);

  return { signals, generateSignal };
};