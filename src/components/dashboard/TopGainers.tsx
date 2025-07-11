import React from 'react';
import { TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { CryptoCurrency, GlobalMarketData, TrendingCoins } from '../../types/crypto';
import { formatCurrency, formatPercentage, formatMarketCap } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface LoadedData {
  globalMarketData: GlobalMarketData | null;
  trendingCoins: TrendingCoins | null;
  topCryptos: CryptoCurrency[] | null;
  allCryptos: CryptoCurrency[] | null;
}

interface TopGainersProps {
  data: LoadedData;
  onCoinSelect?: (coin: CryptoCurrency) => void;
}

export const TopGainers: React.FC<TopGainersProps> = ({ data, onCoinSelect }) => {
  const handleCoinClick = (coin: CryptoCurrency) => {
    if (!onCoinSelect) return;
    onCoinSelect(coin);
  };

  // Get top gainers from the loaded data
  const allCoins = [...(data.topCryptos || []), ...(data.allCryptos || [])];
  const uniqueCoins = allCoins.filter((coin, index, self) => 
    index === self.findIndex(c => c.id === coin.id)
  );
  
  const topGainers = uniqueCoins
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Gainers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Highest price gains in the last 24 hours
            </p>
          </div>
        </div>
        <Badge variant="success">24h</Badge>
      </div>

      <div className="space-y-4">
        {topGainers.slice(0, 10).map((coin, index) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
            onClick={() => handleCoinClick(coin)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold">
                {index + 1}
              </div>
              
              <img
                src={coin.image}
                alt={coin.name}
                className="h-10 w-10 rounded-full"
              />
              
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {coin.name}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="neutral" className="text-xs">
                    Rank #{coin.market_cap_rank}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Vol: {formatMarketCap(coin.total_volume)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </div>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <Badge variant="success" className="font-bold">
                  +{formatPercentage(coin.price_change_percentage_24h).replace('+', '')}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatCurrency(coin.price_change_24h)} gain
              </div>
            </div>
          </div>
        ))}
      </div>

      {topGainers.length === 0 && (
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No significant gainers found in the last 24 hours
          </p>
        </div>
      )}
    </Card>
  );
};