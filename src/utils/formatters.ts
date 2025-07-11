export const formatCurrency = (value: number, forceDecimals?: number): string => {
  // If forceDecimals is provided, use it (for backward compatibility)
  if (forceDecimals !== undefined) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: forceDecimals,
      maximumFractionDigits: forceDecimals,
    }).format(value);
  }

  // Dynamic decimal places based on price ranges
  let decimals: number;
  
  if (value >= 1000) {
    // Price ≥ $1,000: 2 decimal places (e.g., $1,234.56)
    decimals = 2;
  } else if (value >= 1) {
    // Price $1 – $999: 2 decimal places (e.g., $47.89)
    decimals = 2;
  } else if (value >= 0.01) {
    // Price $0.01 – $0.99: 4 decimal places (e.g., $0.0765)
    decimals = 4;
  } else if (value >= 0.0001) {
    // Price $0.0001 – $0.0099: 6 decimal places (e.g., $0.004567)
    decimals = 6;
  } else {
    // Price < $0.0001: 8 decimal places (e.g., $0.00004567)
    decimals = 8;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
};

export const formatVolume = (value: number): string => {
  return formatMarketCap(value);
};

export const getTimeRangeDays = (range: string): number => {
  switch (range) {
    case '24h': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 7;
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};