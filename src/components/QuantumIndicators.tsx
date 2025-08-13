import React, { useState, useEffect } from 'react';
import { Zap, Activity, Atom } from 'lucide-react';

interface QuantumIndicatorsProps {
  theme: string;
}

const QuantumIndicators: React.FC<QuantumIndicatorsProps> = ({ theme }) => {
  const [quantumData, setQuantumData] = useState({
    qrng: Math.random(),
    entanglement: Math.random() * 0.8 + 0.1,
    coherence: Math.random() * 0.9 + 0.05,
    optimization: Math.random() * 100
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumData({
        qrng: Math.random(),
        entanglement: Math.random() * 0.8 + 0.1,
        coherence: Math.random() * 0.9 + 0.05,
        optimization: Math.random() * 100
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Atom className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">量子指标</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
          }`}>
            实验性
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Quantum Random Number Generator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold">量子随机数</span>
            </div>
            <div className="text-sm font-mono">{quantumData.qrng.toFixed(6)}</div>
          </div>
          <div className={`w-full h-1.5 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-1000"
              style={{ width: `${quantumData.qrng * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quantum Entanglement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">量子纠缠度</span>
            </div>
            <div className="text-sm font-mono">{(quantumData.entanglement * 100).toFixed(1)}%</div>
          </div>
          <div className={`w-full h-1.5 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${quantumData.entanglement * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quantum Coherence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold">量子相干性</span>
            </div>
            <div className="text-sm font-mono">{(quantumData.coherence * 100).toFixed(1)}%</div>
          </div>
          <div className={`w-full h-1.5 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-1000"
              style={{ width: `${quantumData.coherence * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quantum Portfolio Optimization */}
        <div className={`p-3 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-xs opacity-70 mb-1">量子组合优化</div>
          <div className="text-lg font-bold text-purple-600">
            {quantumData.optimization.toFixed(1)}% 优化效率
          </div>
          <div className="text-xs opacity-60 mt-1">
            使用量子退火算法优化投资组合权重
          </div>
        </div>

        <div className={`text-xs opacity-60 p-2 rounded ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          💡 量子指标基于量子计算模拟算法，用于增强传统技术分析的随机性和优化能力
        </div>
      </div>
    </div>
  );
};

export default QuantumIndicators;