import { CoinInfo } from '../fortune/types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function fetchTopCoins(limit: number = 100): Promise<CoinInfo[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }

    const data = await response.json();

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));
  } catch (error) {
    console.error('CoinGecko API error:', error);
    return [];
  }
}

export async function fetchCoinById(id: string): Promise<CoinInfo | null> {
  try {
    const response = await fetch(`${COINGECKO_API}/coins/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      image: data.image?.small,
      current_price: data.market_data?.current_price?.usd,
      price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
    };
  } catch (error) {
    console.error('CoinGecko API error:', error);
    return null;
  }
}
