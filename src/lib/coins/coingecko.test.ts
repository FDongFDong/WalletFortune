/**
 * CoinGecko API Tests
 * API 함수에 대한 단위 테스트 (모킹 사용)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTopCoins, fetchCoinById } from './coingecko';

describe('CoinGecko API', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.resetAllMocks();
  });

  describe('fetchTopCoins', () => {
    it('should fetch and transform coin data correctly', async () => {
      const mockResponse = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          current_price: 50000,
          price_change_percentage_24h: 2.5,
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://example.com/eth.png',
          current_price: 3000,
          price_change_percentage_24h: -1.2,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const coins = await fetchTopCoins(10);

      expect(coins).toHaveLength(2);
      expect(coins[0].symbol).toBe('BTC');
      expect(coins[0].name).toBe('Bitcoin');
      expect(coins[1].symbol).toBe('ETH');
    });

    it('should return empty array on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const coins = await fetchTopCoins();

      expect(coins).toEqual([]);
    });

    it('should return empty array on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const coins = await fetchTopCoins();

      expect(coins).toEqual([]);
    });

    it('should use default limit of 100', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchTopCoins();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      );
    });

    it('should use custom limit when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchTopCoins(50);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=50'),
        expect.any(Object)
      );
    });
  });

  describe('fetchCoinById', () => {
    it('should fetch single coin data correctly', async () => {
      const mockResponse = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: { small: 'https://example.com/btc-small.png' },
        market_data: {
          current_price: { usd: 50000 },
          price_change_percentage_24h: 2.5,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const coin = await fetchCoinById('bitcoin');

      expect(coin).not.toBeNull();
      expect(coin?.symbol).toBe('BTC');
      expect(coin?.current_price).toBe(50000);
    });

    it('should return null on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const coin = await fetchCoinById('nonexistent');

      expect(coin).toBeNull();
    });

    it('should return null on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const coin = await fetchCoinById('bitcoin');

      expect(coin).toBeNull();
    });

    it('should handle missing image gracefully', async () => {
      const mockResponse = {
        id: 'test-coin',
        symbol: 'test',
        name: 'Test Coin',
        market_data: {
          current_price: { usd: 100 },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const coin = await fetchCoinById('test-coin');

      expect(coin?.image).toBeUndefined();
    });

    it('should handle missing market data gracefully', async () => {
      const mockResponse = {
        id: 'test-coin',
        symbol: 'test',
        name: 'Test Coin',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const coin = await fetchCoinById('test-coin');

      expect(coin?.current_price).toBeUndefined();
    });
  });
});
