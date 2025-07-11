import React, { useState } from 'react';
import { CryptoCurrency, GlobalMarketData, TrendingCoins } from '../../types/crypto';
import { CoinDetail } from './CoinDetail';
import { MarketOverview } from './MarketOverview';
import { TrendingCoins as TrendingCoinsSection } from './TrendingCoins';
import { TopGainers } from './TopGainers';
import { PaginatedTable } from './PaginatedTable';

interface LoadedData {
  globalMarketData: GlobalMarketData | null;
  trendingCoins: TrendingCoins | null;
  topCryptos: CryptoCurrency[] | null;
  allCryptos: CryptoCurrency[] | null;
}

interface DashboardProps {
  data: LoadedData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);

  const handleCoinSelect = (coin: CryptoCurrency) => {
    setSelectedCoin(coin);
  };

  const handleBackToList = () => {
    setSelectedCoin(null);
  };

  if (selectedCoin) {
    return <CoinDetail coin={selectedCoin} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      {/* Market Overview Section */}
      <MarketOverview data={data} />

      {/* Trending and Gainers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingCoinsSection data={data} onCoinSelect={handleCoinSelect} />
        <TopGainers data={data} onCoinSelect={handleCoinSelect} />
      </div>

      {/* Infinite Scroll Table */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Market Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse all cryptocurrencies with advanced sorting and filtering
          </p>
        </div>
        <PaginatedTable onRowClick={handleCoinSelect} data={data} />
      </div>
    </div>
  )
}