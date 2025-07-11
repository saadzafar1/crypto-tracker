import { CryptoCurrency, CoinDetails, PriceHistory, GlobalMarketData, TrendingCoins, MarketChartData } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

class CoinGeckoAPI {
  private requestQueue: Promise<any> = Promise.resolve();
  private requestCount = 0;
  
  private async queueRequest<T>(requestFn: () => Promise<T>, description?: string): Promise<T> {
    this.requestCount++;
    const requestId = this.requestCount;
    
    console.log(`[API Request ${requestId}] Queuing: ${description || 'Unknown request'}`);
    
    // Queue all requests to prevent concurrent API calls
    this.requestQueue = this.requestQueue.then(async () => {
      console.log(`[API Request ${requestId}] Starting: ${description || 'Unknown request'}`);
      
      // Add delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      const result = await requestFn();
      console.log(`[API Request ${requestId}] Completed: ${description || 'Unknown request'}`);
      
      return result;
    });
    
    return this.requestQueue;
  }
  
  private async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        
        if (response.status === 429) {
          // Rate limit hit, wait and retry
          const delay = Math.min(20000 * (i + 1), 120000); // Even longer delays for rate limits
          console.warn(`Rate limit hit, waiting ${delay}ms before retry ${i + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        const delay = 10000 * (i + 1); // Longer delays between retries
        console.warn(`Request failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  async getCryptocurrencies(page = 1, perPage = 50): Promise<CryptoCurrency[]> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
      return this.fetchWithRetry<CryptoCurrency[]>(url);
    }, `Get cryptocurrencies (page ${page}, ${perPage} per page)`);
  }

  async getCoinDetails(id: string): Promise<CoinDetails> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/${id}`;
      return this.fetchWithRetry<CoinDetails>(url);
    }, `Get coin details for ${id}`);
  }

  async getPriceHistory(id: string, days: number): Promise<PriceHistory> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      return this.fetchWithRetry<PriceHistory>(url);
    }, `Get price history for ${id} (${days} days)`);
  }

  async getGlobalMarketData(): Promise<GlobalMarketData> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/global`;
      return this.fetchWithRetry<GlobalMarketData>(url);
    }, 'Get global market data');
  }

  async getTrendingCoins(): Promise<TrendingCoins> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/search/trending`;
      return this.fetchWithRetry<TrendingCoins>(url);
    }, 'Get trending coins');
  }

  async getAllCryptocurrencies(): Promise<CryptoCurrency[]> {
    // Fetch cryptocurrencies in a single request to minimize API calls
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=7d`;
      return this.fetchWithRetry<CryptoCurrency[]>(url);
    }, 'Get all cryptocurrencies (250 coins)');
  }

  // Deprecated methods - keeping for compatibility but they won't be used
  async searchCoins(query: string): Promise<any[]> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
      const response = await this.fetchWithRetry<{ coins: any[] }>(url);
      return response.coins;
    }, `Search coins: ${query}`);
  }

  async getTopGainers(limit = 10): Promise<CryptoCurrency[]> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
      return this.fetchWithRetry<CryptoCurrency[]>(url);
    }, `Get top ${limit} gainers`);
  }

  async getMarketChart(days = 30): Promise<MarketChartData> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;
      return this.fetchWithRetry<MarketChartData>(url);
    }, `Get market chart (${days} days)`);
  }

  async getCryptocurrenciesPaginated(page = 1, perPage = 10): Promise<CryptoCurrency[]> {
    return this.queueRequest(async () => {
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
      return this.fetchWithRetry<CryptoCurrency[]>(url);
    }, `Get cryptocurrencies paginated (page ${page})`);
  }

  async getCryptocurrenciesByIds(ids: string[]): Promise<CryptoCurrency[]> {
    if (ids.length === 0) return [];
    
    return this.queueRequest(async () => {
      const idsParam = ids.slice(0, 10).join(','); // Limit to 10 IDs
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
      return this.fetchWithRetry<CryptoCurrency[]>(url);
    }, `Get cryptocurrencies by IDs: ${ids.slice(0, 3).join(', ')}${ids.length > 3 ? '...' : ''}`);
  }
}

export const coinGeckoAPI = new CoinGeckoAPI();