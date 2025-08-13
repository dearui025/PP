import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Shield } from 'lucide-react';

interface PortfolioOverviewProps {
  theme: string;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ theme }) => {
  const portfolioData = {
    totalValue: 125678.90,
    dailyChange: 3456.78,
    dailyChangePercent: 2.83,
    positions: [
      { symbol: 'BTC', amount: 1.2345, value: 56432.10, allocation: 44.9 },
      { symbol: 'ETH', amount: 15.678, value: 35012.45, allocation: 27.9 },
      { symbol: 'BNB', amount: 89.123, value: 27845.67, allocation: 22.2 },
      { symbol: 'ADA', amount: 12345.67, value: 5678.90, allocation: 4.5 },
    ],
    riskMetrics: {
      sharpeRatio: 1.67,
      maxDrawdown: -8.45,
      volatility: 12.34
    }
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">投资组合概览</h3>
        </div>
      </div>
      
      <div className="p-4">
        {/* Total Value */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm opacity-70">总资产价值</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            ${portfolioData.totalValue.toLocaleString()}
          </div>
          <div className={`flex items-center space-x-1 text-sm mt-1 ${
            portfolioData.dailyChange > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {portfolioData.dailyChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>+${portfolioData.dailyChange.toFixed(2)} ({portfolioData.dailyChangePercent}%)</span>
          </div>
        </div>

        {/* Holdings */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 opacity-80">持仓分布</h4>
          <div className="space-y-2">
            {portfolioData.positions.map((position) => (
              <div key={position.symbol} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {position.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{position.amount.toFixed(4)}</div>
                    <div className="text-xs opacity-60">{position.allocation}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">${position.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Metrics */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold opacity-80">风险指标</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="opacity-70">夏普比率</div>
              <div className="font-bold text-green-500">{portfolioData.riskMetrics.sharpeRatio}</div>
            </div>
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="opacity-70">最大回撤</div>
              <div className="font-bold text-red-500">{portfolioData.riskMetrics.maxDrawdown}%</div>
            </div>
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="opacity-70">波动率</div>
              <div className="font-bold text-yellow-500">{portfolioData.riskMetrics.volatility}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;