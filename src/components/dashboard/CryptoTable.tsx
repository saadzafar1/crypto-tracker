import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoCurrency, SortField, SortOrder } from '../../types/crypto';
import { formatCurrency, formatPercentage, formatMarketCap } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MiniChart } from '../common/MiniChart';

interface CryptoTableProps {
  data: CryptoCurrency[];
  onRowClick: (crypto: CryptoCurrency) => void;
  searchQuery?: string;
}

export const CryptoTable: React.FC<CryptoTableProps> = ({ 
  data, 
  onRowClick, 
  searchQuery = '' 
}) => {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = data.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleWatchlist = (coinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(coinId)) {
      newWatchlist.delete(coinId);
    } else {
      newWatchlist.add(coinId);
    }
    setWatchlist(newWatchlist);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  <SortIcon field="current_price" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center space-x-1">
                  <span>24h %</span>
                  <SortIcon field="price_change_percentage_24h" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center space-x-1">
                  <span>Market Cap</span>
                  <SortIcon field="market_cap" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center space-x-1">
                  <span>Volume (24h)</span>
                  <SortIcon field="total_volume" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last 7 Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedData.map((crypto) => (
              <tr
                key={crypto.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onRowClick(crypto)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {crypto.market_cap_rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full mr-3"
                      src={crypto.image}
                      alt={crypto.name}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {crypto.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(crypto.current_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {crypto.price_change_percentage_24h > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <Badge
                      variant={crypto.price_change_percentage_24h > 0 ? 'success' : 'error'}
                    >
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatMarketCap(crypto.market_cap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatMarketCap(crypto.total_volume)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24 h-10">
                    <MiniChart
                      data={crypto.sparkline_in_7d.price}
                      color={crypto.price_change_percentage_7d_in_currency > 0 ? '#10B981' : '#EF4444'}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={(e) => toggleWatchlist(crypto.id, e)}
                    className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      watchlist.has(crypto.id) ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Star className="h-5 w-5" fill={watchlist.has(crypto.id) ? 'currentColor' : 'none'} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};