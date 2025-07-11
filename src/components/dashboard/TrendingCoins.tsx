import React from 'react';
import { TrendingUp, Star, ExternalLink } from 'lucide-react';
import { TrendingCoins as TrendingCoinsType, CryptoCurrency, GlobalMarketData } from '../../types/crypto';
import { formatCurrency, formatPercentage, formatMarketCap } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface LoadedData {
  globalMarketData: GlobalMarketData | null;
  trendingCoins: TrendingCoinsType | null;
  topCryptos: CryptoCurrency[] | null;
  allCryptos: CryptoCurrency[] | null;
}

interface TrendingCoinsProps {
  data: LoadedData;
  onCoinSelect?: (coin: CryptoCurrency) => void;
}

export const TrendingCoins: React.FC<TrendingCoinsProps> = ({ data, onCoinSelect }) => {
  const handleCoinClick = (coin: any) => {
    if (!onCoinSelect) return;
    
    // Convert trending coin to CryptoCurrency format for detail view
    const cryptoCurrency: CryptoCurrency = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image || coin.large || coin.thumb,
      current_price: coin.current_price || 0,
      market_cap: coin.market_cap || 0,
      market_cap_rank: coin.market_cap_rank || 0,
      fully_diluted_valuation: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: 0,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: 0,
      max_supply: 0,
      ath: 0,
      ath_change_percentage: 0,
      ath_date: '',
      atl: 0,
      atl_change_percentage: 0,
      atl_date: '',
      last_updated: '',
      sparkline_in_7d: { price: [] },
      price_change_percentage_7d_in_currency: 0,
    };
    
    onCoinSelect(cryptoCurrency);
  };

  // Merge trending data with market data
  const trendingCoins = data.trendingCoins?.coins?.slice(0, 10).map(({ item }) => {
    // Try to find market data from both datasets
    let marketInfo = data.topCryptos?.find(coin => coin.id === item.id);
    if (!marketInfo) {
      marketInfo = data.allCryptos?.find(coin => coin.id === item.id);
    }
    
    // If still no market info, create a basic structure with available data
    if (!marketInfo) {
      // Use the price_btc from trending data to estimate USD price
      // Assuming 1 BTC ≈ $43,000 (this is a rough estimate for display purposes)
      const estimatedPrice = item.price_btc ? item.price_btc * 43000 : null;
      
      return {
        ...item,
        current_price: estimatedPrice,
        price_change_percentage_24h: null, // No 24h data available
        market_cap: null, // No market cap data available
        market_cap_rank: item.market_cap_rank,
        image: item.large,
      };
    }
    
    return {
      ...item,
      current_price: marketInfo?.current_price || null,
      price_change_percentage_24h: marketInfo?.price_change_percentage_24h || null,
      market_cap: marketInfo?.market_cap || null,
      market_cap_rank: marketInfo?.market_cap_rank || item.market_cap_rank,
      image: marketInfo?.image || item.large,
    };
  }) || [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trending Coins
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Most searched cryptocurrencies in the last 24h
            </p>
          </div>
        </div>
        <Badge variant="warning">Hot</Badge>
      </div>

      <div className="space-y-4">
        {trendingCoins.map((coin, index) => (
          <div
            key={coin.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group space-y-3 sm:space-y-0"
            onClick={() => handleCoinClick(coin)}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold">
                {index + 1}
              </div>
              
              <img
                src={coin.large || coin.image}
                alt={coin.name}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = coin.thumb;
                }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base truncate">
                    {coin.name}
                  </h4>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase flex-shrink-0">
                    {coin.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1 flex-wrap">
                  <Badge variant="neutral" className="text-xs">
                    Rank #{coin.market_cap_rank}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Score: {coin.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right space-x-2 sm:space-x-0">
              <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {coin.current_price ? formatCurrency(coin.current_price) : (
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Price unavailable
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end space-y-1">
                {coin.price_change_percentage_24h !== undefined && coin.price_change_percentage_24h !== null && (
                  <Badge
                    variant={coin.price_change_percentage_24h > 0 ? 'success' : 'error'}
                    className="text-xs"
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </Badge>
                )}
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {coin.market_cap ? formatMarketCap(coin.market_cap) : (
                    coin.current_price ? (
                      <span>Trending #{coin.market_cap_rank}</span>
                    ) : (
                      <span>Market data unavailable</span>
                    )
                  )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {trendingCoins.length === 0 && (
        <button className="flex items-center justify-center w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          <ExternalLink className="h-4 w-4 mr-2" />
          View all trending coins
        </button>
      )}
    </Card>
  );
};