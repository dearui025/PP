// 价格格式化工具
export const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else if (price < 100) {
    return price.toFixed(2);
  } else {
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`;
  } else if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toFixed(2);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};