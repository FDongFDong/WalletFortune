/**
 * Coin Matching Module
 * 오행(Five Elements)과 암호화폐를 매칭하는 모듈
 *
 * 오행 배속 기준:
 * - 수(水): DeFi/유동성 - 물처럼 흐르는 자금
 * - 목(木): L2/신기술 - 성장하는 생태계
 * - 화(火): 밈/게임 - 열정적이고 활발한
 * - 토(土): 메이저/안정 - 땅처럼 견고한 기반
 * - 금(金): 인프라/가치저장 - 금속처럼 가치있는
 */

import { Element, CoinInfo } from '../fortune/types';

/** 오행별 코인 매핑 */
export const elementCoins: Record<Element, CoinInfo[]> = {
  // 수(水) - DeFi/유동성 프로토콜
  water: [
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
    { id: 'aave', symbol: 'AAVE', name: 'Aave' },
    { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO Token' },
    { id: 'sushi', symbol: 'SUSHI', name: 'SushiSwap' },
    { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap' },
  ],
  // 목(木) - L2/신기술 체인
  wood: [
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
    { id: 'optimism', symbol: 'OP', name: 'Optimism' },
    { id: 'aptos', symbol: 'APT', name: 'Aptos' },
    { id: 'sui', symbol: 'SUI', name: 'Sui' },
    { id: 'starknet', symbol: 'STRK', name: 'Starknet' },
  ],
  // 화(火) - 밈/게임 토큰
  fire: [
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe' },
    { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity' },
    { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox' },
  ],
  // 토(土) - 메이저/안정 코인
  earth: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  ],
  // 금(金) - 인프라/가치저장
  metal: [
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { id: 'maker', symbol: 'MKR', name: 'Maker' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
    { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  ],
};

/**
 * 주요 원소에 해당하는 추천 코인 심볼 반환
 * @param element - 오행 원소
 * @returns 상위 3개 코인 심볼 배열
 */
export function getRecommendedCoins(element: Element): string[] {
  return elementCoins[element].slice(0, 3).map((c) => c.symbol);
}

/**
 * 약한 원소에 해당하는 주의 코인 심볼 반환
 * @param element - 오행 원소
 * @returns 상위 2개 코인 심볼 배열
 */
export function getCautionCoins(element: Element): string[] {
  return elementCoins[element].slice(0, 2).map((c) => c.symbol);
}

/**
 * 특정 원소의 전체 코인 정보 반환
 * @param element - 오행 원소
 * @returns CoinInfo 배열
 */
export function getElementCoins(element: Element): CoinInfo[] {
  return elementCoins[element];
}
