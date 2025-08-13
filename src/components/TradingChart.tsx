import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { marketDataService, KlineData } from '../services/marketApi';

interface TradingChartProps {
  selectedPair: string;
  theme: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ selectedPair, theme }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [klineData, setKlineData] = React.useState<KlineData[]>([]);
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);

  useEffect(() => {
    // 获取K线数据
    const fetchKlineData = async () => {
      try {
        const data = await marketDataService.getKlineData(selectedPair, '1h', 50);
        setKlineData(data);
        if (data.length > 0) {
          setCurrentPrice(data[data.length - 1].close);
        }
      } catch (error) {
        console.error('获取K线数据失败:', error);
      }
    };

    fetchKlineData();

    // 订阅实时价格更新
    marketDataService.subscribeToPrice(selectedPair, (priceData) => {
      setCurrentPrice(priceData.price);
    });

    return () => {
      marketDataService.unsubscribeFromPrice(selectedPair);
    };
  }, [selectedPair]);

  useEffect(() => {
    // 绘制图表
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    
    if (chartRef.current) {
      chartRef.current.innerHTML = '';
      chartRef.current.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawChart(ctx, theme === 'dark', klineData);
      }
    }
  }, [selectedPair, theme, klineData]);

  const drawChart = (ctx: CanvasRenderingContext2D, isDark: boolean, data: KlineData[]) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Background
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = isDark ? '#374151' : '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 8) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      if (i <= 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    if (data.length === 0) {
      // 显示加载状态
      ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('加载K线数据中...', width / 2, height / 2);
      return;
    }
    
    // 计算价格范围
    const prices = data.map(d => [d.high, d.low]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // 绘制K线
    const candleWidth = (width / data.length) * 0.8;
    const candleSpacing = width / data.length;
    
    data.forEach((candle, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const openY = height - ((candle.open - minPrice) / priceRange) * height * 0.8;
      const closeY = height - ((candle.close - minPrice) / priceRange) * height * 0.8;
      const highY = height - ((candle.high - minPrice) / priceRange) * height * 0.8;
      const lowY = height - ((candle.low - minPrice) / priceRange) * height * 0.8;
      
      // 绘制影线
      ctx.strokeStyle = isDark ? '#6b7280' : '#9ca3af';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // 绘制实体
      const isGreen = candle.close > candle.open;
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY));
    });
    
    // 绘制价格线（连接收盘价）
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((candle, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const y = height - ((candle.close - minPrice) / priceRange) * height * 0.8;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Price labels
    ctx.fillStyle = isDark ? '#f3f4f6' : '#1f2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${selectedPair}: $${currentPrice.toLocaleString()}`, 20, 30);
  };

  // 计算价格变化
  const priceChange = klineData.length >= 2 ? 
    klineData[klineData.length - 1].close - klineData[klineData.length - 2].close : 0;
  const priceChangePercent = klineData.length >= 2 ? 
    (priceChange / klineData[klineData.length - 2].close) * 100 : 0;

  // 获取OHLC数据
  const ohlcData = klineData.length > 0 ? {
    open: klineData[klineData.length - 1].open,
    high: Math.max(...klineData.slice(-24).map(k => k.high)),
    low: Math.min(...klineData.slice(-24).map(k => k.low)),
    volume: klineData.slice(-24).reduce((sum, k) => sum + k.volume, 0)
  } : { open: 0, high: 0, low: 0, volume: 0 };

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">{selectedPair} 实时图表</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPrice.toLocaleString()}</div>
              <div className={`flex items-center space-x-1 text-sm ${
                priceChange > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {priceChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>+${priceChange.toFixed(2)} ({priceChangePercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div ref={chartRef} className="w-full overflow-hidden rounded-lg">
          {/* Chart will be rendered here */}
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="opacity-70">开盘价</span>
            <div className="font-semibold">${ohlcData.open.toLocaleString()}</div>
          </div>
          <div>
            <span className="opacity-70">最高价</span>
            <div className="font-semibold text-green-500">${ohlcData.high.toLocaleString()}</div>
          </div>
          <div>
            <span className="opacity-70">最低价</span>
            <div className="font-semibold text-red-500">${ohlcData.low.toLocaleString()}</div>
          </div>
          <div>
            <span className="opacity-70">成交量</span>
            <div className="font-semibold">{(ohlcData.volume / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;