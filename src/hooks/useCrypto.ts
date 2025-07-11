// All React Query hooks are now completely disabled to prevent any duplicate requests
// The sequential data loader handles all API calls

export const useCryptocurrencies = () => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useCoinDetails = (coinId: string) => ({
  data: null,
  isLoading: false,
  error: null,
});

export const usePriceHistory = (coinId: string, days: number) => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useGlobalMarketData = () => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useTrendingCoins = () => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useTopGainers = (limit = 10) => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useMarketChart = (days = 30) => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useCryptocurrenciesAll = () => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useCryptocurrenciesInfinite = () => ({
  data: { pages: [] },
  isLoading: false,
  hasNextPage: false,
  fetchNextPage: () => {},
});

export const useTrendingCoinsWithPrices = () => ({
  data: null,
  isLoading: false,
  error: null,
});