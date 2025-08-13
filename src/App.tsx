import React, { useState, useEffect } from 'react';
import { TrendingUp, Moon, Sun, Settings, Send, Activity, DollarSign, BarChart3, Zap } from 'lucide-react';
import TradingChart from './components/TradingChart';
import MarketData from './components/MarketData';
import TradingSignals from './components/TradingSignals';
import PortfolioOverview from './components/PortfolioOverview';
import AIAnalysis from './components/AIAnalysis';
import QuantumIndicators from './components/QuantumIndicators';
import { useTheme } from './hooks/useTheme';
import { useTradingData } from './hooks/useTradingData';
import { useAISignals } from './hooks/useAISignals';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { marketData, isLoading, error } = useTradingData();
  const { signals, generateSignal } = useAISignals();
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [inputValue, setInputValue] = useState('');

  const handleSendAnalysis = () => {
    if (inputValue.trim()) {
      generateSignal(inputValue, selectedPair);
      setInputValue('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">QuantumTrade Pro</h1>
                <p className="text-xs opacity-70">AI-Powered Trading Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Live Market</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trading Chart & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <TradingChart selectedPair={selectedPair} theme={theme} />
            <AIAnalysis signals={signals} theme={theme} />
          </div>

          {/* Right Column - Market Data & Controls */}
          <div className="space-y-6">
            <MarketData 
              marketData={marketData} 
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
              theme={theme}
              isLoading={isLoading}
              error={error}
            />
            <QuantumIndicators theme={theme} />
            <PortfolioOverview theme={theme} />
          </div>
        </div>

        {/* Trading Signals */}
        <div className="mt-6">
          <TradingSignals signals={signals} theme={theme} />
        </div>
      </main>

      {/* Bottom Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Settings className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
              <select 
                className={`pl-10 pr-4 py-2 rounded-lg border text-sm min-w-[120px] transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="BNB/USDT">BNB/USDT</option>
                <option value="ADA/USDT">ADA/USDT</option>
                <option value="SOL/USDT">SOL/USDT</option>
              </select>
            </div>
            
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入交易对或策略需求 (例如: 分析BTC趋势, RSI指标, 量子信号)"
                className={`w-full p-3 rounded-lg border resize-none transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                rows={2}
              />
            </div>
            
            <button
              onClick={handleSendAnalysis}
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-24"></div>
    </div>
  );
}

export default App;