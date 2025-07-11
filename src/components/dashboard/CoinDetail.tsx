import React, { useState } from 'react';
import { ArrowLeft, Globe, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoCurrency, TimeRange } from '../../types/crypto';
import { coinGeckoAPI } from '../../services/api';
import { formatCurrency, formatPercentage, formatMarketCap, getTimeRangeDays, truncateText } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PriceChart } from './PriceChart';
import { StatsCard } from './StatsCard';

interface CoinDetailProps {
  coin: CryptoCurrency;
  onBack: () => void;
}

export const CoinDetail: React.FC<CoinDetailProps> = ({ coin, onBack }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [coinDetails, setCoinDetails] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  
  React.useEffect(() => {
    const loadCoinDetails = async () => {
      try {
        setDetailsLoading(true);
        const details = await coinGeckoAPI.getCoinDetails(coin.id);
        setCoinDetails(details);
      } catch (error) {
        console.error('Failed to load coin details:', error);
      } finally {
        setDetailsLoading(false);
      }
    };
    
    loadCoinDetails();
  }, [coin.id]);
  
  React.useEffect(() => {
    const loadPriceHistory = async () => {
      try {
        setChartLoading(true);
        const history = await coinGeckoAPI.getPriceHistory(coin.id, getTimeRangeDays(timeRange));
        setPriceHistory(history);
      } catch (error) {
        console.error('Failed to load price history:', error);
      } finally {
        setChartLoading(false);
      }
    };
    
    loadPriceHistory();
  }, [coin.id, timeRange]);

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '90d', '1y'];

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {coin.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 uppercase">
                {coin.symbol} • Rank #{coin.market_cap_rank}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="info">
            <Globe className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://coingecko.com/en/coins/${coin.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on CoinGecko
          </Button>
        </div>
      </div>

      {/* Price Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Price
            </h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.current_price)}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {coin.price_change_percentage_24h > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={coin.price_change_percentage_24h > 0 ? 'success' : 'error'}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(coin.price_change_24h)}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              24h Range
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Low</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(coin.low_24h)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">High</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(coin.high_24h)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              All-Time High
            </h3>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.ath)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <Badge variant="error">
                {formatPercentage(coin.ath_change_percentage)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Market Cap"
          value={formatMarketCap(coin.market_cap)}
          change={coin.market_cap_change_percentage_24h}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          color="blue"
        />
        <StatsCard
          title="Volume (24h)"
          value={formatMarketCap(coin.total_volume)}
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          color="purple"
        />
        <StatsCard
          title="Circulating Supply"
          value={`${(coin.circulating_supply / 1e6).toFixed(1)}M`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          color="emerald"
        />
        <StatsCard
          title="Max Supply"
          value={coin.max_supply ? `${(coin.max_supply / 1e6).toFixed(1)}M` : 'N/A'}
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Price Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Price Chart
          </h3>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        
        {chartLoading ? (
          <div className="flex items-center justify-center h-80">
            <LoadingSpinner size="lg" />
          </div>
        ) : priceHistory ? (
          <PriceChart
            data={priceHistory.prices}
            title={`${coin.name} Price (${timeRange})`}
            color={coin.price_change_percentage_24h > 0 ? '#10B981' : '#EF4444'}
          />
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
            No chart data available
          </div>
        )}
      </Card>

      {/* Description */}
      {coinDetails?.description?.en && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About {coin.name}
          </h3>
          <div 
            className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ 
              __html: truncateText(coinDetails.description.en, 500)
            }}
          />
        </Card>
      )}
    </div>
  );
};