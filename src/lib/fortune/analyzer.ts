import { FortuneResult } from './types';
import { analyzePersonality } from './personality';
import { analyzeElements } from './elements';
import { analyzeYinYang } from './yinyang';
import { analyzePatterns } from './patterns';
import { calculateLuckyIndex } from './luckyIndex';
import { getRecommendedCoins, getCautionCoins } from '../coins/matching';
import { getAddress, isAddress } from 'viem';

export function analyzeWallet(address: string): FortuneResult | null {
  if (!isAddress(address)) {
    return null;
  }

  const checksumAddress = getAddress(address);
  const personality = analyzePersonality(address);
  const elements = analyzeElements(address);
  const yinyang = analyzeYinYang(address);
  const patterns = analyzePatterns(address);
  const luckyIndex = calculateLuckyIndex(address, elements, yinyang, patterns);
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
