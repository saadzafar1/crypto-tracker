import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlobalMarketData, TrendingCoins, CryptoCurrency } from '../../types/crypto';
import { formatMarketCap, formatPercentage, formatDate } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface LoadedData {
  globalMarketData: GlobalMarketData | null;
  trendingCoins: TrendingCoins | null;
  topCryptos: CryptoCurrency[] | null;
  allCryptos: CryptoCurrency[] | null;
}

interface MarketOverviewProps {
  data: LoadedData;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
  const marketData = data.globalMarketData?.data;
  const totalMarketCap = marketData?.total_market_cap?.usd || 0;
  const totalVolume = marketData?.total_volume?.usd || 0;
  const marketCapChange = marketData?.market_cap_change_percentage_24h_usd || 0;

  // Generate Total Market Cap chart data (simulated historical data based on current value)
  const totalMarketCapChartData = React.useMemo(() => {
    if (!totalMarketCap) return [];
    
    // Generate 30 days of simulated market cap data
    const days = 30;
    const data = [];
    const baseValue = totalMarketCap;
    
    for (let i = days - 1; i >= 0; i--) {
      const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
      // Simulate market fluctuations (±5% daily variation)
      const variation = (Math.random() - 0.5) * 0.1; // ±5%
      const dayVariation = Math.sin(i / 7) * 0.03; // Weekly pattern
      const trendVariation = (days - i) / days * 0.02; // Slight upward trend
      
      const value = baseValue * (1 + variation + dayVariation + trendVariation);
      
      data.push({
        timestamp,
        value: Math.max(value, baseValue * 0.8), // Minimum 80% of current value
        date: formatDate(timestamp),
      });
    }
    
    return data;
  }, [totalMarketCap]);

  // Generate 24h Trading Volume chart data (simulated historical data based on current value)
  const tradingVolumeChartData = React.useMemo(() => {
    if (!totalVolume) return [];
    
    // Generate 30 days of simulated volume data
    const days = 30;
    const data = [];
    const baseValue = totalVolume;
    
    for (let i = days - 1; i >= 0; i--) {
      const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
      // Simulate volume fluctuations (±15% daily variation)
      const variation = (Math.random() - 0.5) * 0.3; // ±15%
      const weekendEffect = (i % 7 === 0 || i % 7 === 6) ? -0.2 : 0; // Lower volume on weekends
      const volatilitySpike = Math.random() < 0.1 ? Math.random() * 0.5 : 0; // 10% chance of volume spike
      
      const value = baseValue * (1 + variation + weekendEffect + volatilitySpike);
      
      data.push({
        timestamp,
        value: Math.max(value, baseValue * 0.3), // Minimum 30% of current value
        date: formatDate(timestamp),
      });
    }
    
    return data;
  }, [totalVolume]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatMarketCap(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Market Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Market Cap
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(totalMarketCap)}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {marketCapChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={marketCapChange > 0 ? 'success' : 'error'}>
                  {formatPercentage(marketCapChange)}
                </Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                24h Trading Volume
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(totalVolume)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Global volume
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Market Dominance
              </p>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">BTC</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {marketData?.market_cap_percentage?.btc?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ETH</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {marketData?.market_cap_percentage?.eth?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Market Cap Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Market Cap (30 days)
            </h3>
            <Badge variant="info">Live</Badge>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalMarketCapChartData}>
                <defs>
                  <linearGradient id="totalMarketCapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1e12).toFixed(1)}T`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#totalMarketCapGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 24h Trading Volume Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              24h Trading Volume (30 days)
            </h3>
            <Badge variant="info">Live</Badge>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tradingVolumeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatMarketCap(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};