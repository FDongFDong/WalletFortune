import { Element, CoinInfo } from '../fortune/types';

export const elementCoins: Record<Element, CoinInfo[]> = {
  water: [
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
    { id: 'aave', symbol: 'AAVE', name: 'Aave' },
    { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO Token' },
    { id: 'sushi', symbol: 'SUSHI', name: 'SushiSwap' },
    { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap' },
  ],
  wood: [
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
    { id: 'optimism', symbol: 'OP', name: 'Optimism' },
    { id: 'aptos', symbol: 'APT', name: 'Aptos' },
    { id: 'sui', symbol: 'SUI', name: 'Sui' },
    { id: 'starknet', symbol: 'STRK', name: 'Starknet' },
  ],
  fire: [
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe' },
    { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity' },
    { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox' },
  ],
  earth: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  ],
  metal: [
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { id: 'maker', symbol: 'MKR', name: 'Maker' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
    { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  ],
};

export function getRecommendedCoins(element: Element): string[] {
  return elementCoins[element].slice(0, 3).map((c) => c.symbol);
}

export function getCautionCoins(element: Element): string[] {
  return elementCoins[element].slice(0, 2).map((c) => c.symbol);
}

export function getElementCoins(element: Element): CoinInfo[] {
  return elementCoins[element];
}
