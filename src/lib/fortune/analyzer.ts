/**
 * Wallet Fortune Analyzer
 * 지갑 주소를 분석하여 운세 결과를 생성하는 메인 모듈
 */

import { FortuneResult } from './types';
import { analyzePersonality } from './personality';
import { analyzeElements } from './elements';
import { analyzeYinYang } from './yinyang';
import { analyzePatterns } from './patterns';
import { calculateLuckyIndex } from './luckyIndex';
import { getRecommendedCoins, getCautionCoins } from '../coins/matching';
import { getAddress, isAddress } from 'viem';

/**
 * 지갑 주소를 분석하여 운세 결과를 반환
 * @param address - 이더리움 지갑 주소 (0x...)
 * @returns FortuneResult 객체 또는 유효하지 않은 주소인 경우 null
 *
 * @example
 * const result = analyzeWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
 * console.log(result?.luckyIndex); // 75
 */
export function analyzeWallet(address: string): FortuneResult | null {
  // viem의 isAddress로 유효성 검증
  if (!isAddress(address)) {
    return null;
  }

  // EIP-55 체크섬 주소로 변환
  const checksumAddress = getAddress(address);

  // 각 분석 모듈 실행
  const personality = analyzePersonality(address);
  const elements = analyzeElements(address);
  const yinyang = analyzeYinYang(address);
  const patterns = analyzePatterns(address);

  // 행운 지수 계산 (다른 분석 결과 기반)
  const luckyIndex = calculateLuckyIndex(address, elements, yinyang, patterns);

  // 오행 기반 코인 추천
  const recommendedCoins = getRecommendedCoins(elements.mainElement);
  const cautionCoins = getCautionCoins(elements.weakElement);

  return {
    address,
    checksumAddress,
    personality,
    elements,
    yinyang,
    patterns,
    luckyIndex,
    recommendedCoins,
    cautionCoins,
  };
}
