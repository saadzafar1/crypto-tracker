import { useState, useEffect, useCallback, useRef } from 'react';
import { coinGeckoAPI } from '../services/api';
import { CryptoCurrency, GlobalMarketData, TrendingCoins } from '../types/crypto';

interface LoadedData {
  globalMarketData: GlobalMarketData | null;
  trendingCoins: TrendingCoins | null;
  topCryptos: CryptoCurrency[] | null;
  allCryptos: CryptoCurrency[] | null;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress: number;
  currentStep: string;
}

// Global state to prevent multiple instances from loading data simultaneously
let globalLoadingPromise: Promise<LoadedData> | null = null;
let globalData: LoadedData | null = null;
let globalError: string | null = null;

export const useSequentialDataLoader = () => {
  const [data, setData] = useState<LoadedData>({
    globalMarketData: null,
    trendingCoins: null,
    topCryptos: null,
    allCryptos: null,
  });

  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
    progress: 0,
    currentStep: 'Initializing...',
  });

  const hasInitialized = useRef(false);

  const loadDataSequentially = useCallback(async (): Promise<LoadedData> => {
    // If we already have global data, return it immediately
    if (globalData) {
      return globalData;
    }

    // If there's already a loading promise, wait for it
    if (globalLoadingPromise) {
      return globalLoadingPromise;
    }

    // Create new loading promise
    globalLoadingPromise = (async () => {
      try {
        const newData: LoadedData = {
          globalMarketData: null,
          trendingCoins: null,
          topCryptos: null,
          allCryptos: null,
        };

        // Step 1: Load global market data
        console.log('Loading global market data...');
        setLoadingState({
          isLoading: true,
          error: null,
          progress: 0,
          currentStep: 'Loading global market data...',
        });

        newData.globalMarketData = await coinGeckoAPI.getGlobalMarketData();
        setData(prev => ({ ...prev, globalMarketData: newData.globalMarketData }));
        setLoadingState(prev => ({
          ...prev,
          progress: 25,
          currentStep: 'Loading trending coins...',
        }));

        // Step 2: Load trending coins
        console.log('Loading trending coins...');
        newData.trendingCoins = await coinGeckoAPI.getTrendingCoins();
        setData(prev => ({ ...prev, trendingCoins: newData.trendingCoins }));
        setLoadingState(prev => ({
          ...prev,
          progress: 50,
          currentStep: 'Loading top cryptocurrencies...',
        }));

        // Step 3: Load top 100 cryptocurrencies
        console.log('Loading top cryptocurrencies...');
        newData.topCryptos = await coinGeckoAPI.getCryptocurrencies(1, 100);
        setData(prev => ({ ...prev, topCryptos: newData.topCryptos }));
        setLoadingState(prev => ({
          ...prev,
          progress: 75,
          currentStep: 'Loading complete market data...',
        }));

        // Step 4: Load all cryptocurrencies
        console.log('Loading all cryptocurrencies...');
        newData.allCryptos = await coinGeckoAPI.getAllCryptocurrencies();
        setData(prev => ({ ...prev, allCryptos: newData.allCryptos }));
        setLoadingState(prev => ({
          ...prev,
          progress: 100,
          currentStep: 'Finalizing...',
        }));

        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 300));

        // Store globally
        globalData = newData;
        globalError = null;

        setLoadingState({
          isLoading: false,
          error: null,
          progress: 100,
          currentStep: 'Complete',
        });

        console.log('All data loaded successfully');
        return newData;

      } catch (error) {
        console.error('Error loading data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        
        globalError = errorMessage;
        globalLoadingPromise = null; // Reset so it can be retried
        
        setLoadingState({
          isLoading: false,
          error: errorMessage,
          progress: 0,
          currentStep: 'Error',
        });

        throw error;
      }
    })();

    return globalLoadingPromise;
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    // If we already have global data, use it immediately
    if (globalData) {
      setData(globalData);
      setLoadingState({
        isLoading: false,
        error: null,
        progress: 100,
        currentStep: 'Complete',
      });
      return;
    }

    // If there's a global error, show it
    if (globalError) {
      setLoadingState({
        isLoading: false,
        error: globalError,
        progress: 0,
        currentStep: 'Error',
      });
      return;
    }

    // Start loading
    loadDataSequentially().catch(() => {
      // Error is already handled in the function
    });
  }, [loadDataSequentially]);

  const refetchData = useCallback(async () => {
    // Reset global state to force reload
    globalData = null;
    globalError = null;
    globalLoadingPromise = null;
    hasInitialized.current = false;

    // Reset local state
    setData({
      globalMarketData: null,
      trendingCoins: null,
      topCryptos: null,
      allCryptos: null,
    });

    // Start loading again
    hasInitialized.current = true;
    await loadDataSequentially();
  }, [loadDataSequentially]);

  return {
    data,
    loadingState,
    refetchData,
  };
};