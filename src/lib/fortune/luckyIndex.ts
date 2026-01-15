import { ElementAnalysis, YinYangAnalysis, PatternAnalysis } from './types';

export function calculateLuckyIndex(
  address: string,
  elements: ElementAnalysis,
  yinyang: YinYangAnalysis,
  patterns: PatternAnalysis
): number {
  const cleanAddress = address.toLowerCase().replace('0x', '');

  let score = 50;

  const luckyDigits = ['7', '8', '9'];
  let luckyCount = 0;
  for (const char of cleanAddress) {
    if (luckyDigits.includes(char)) {
      luckyCount++;
    }
  }
  const luckyRatio = luckyCount / cleanAddress.length;
  score += luckyRatio * 10;

  score += patterns.bonus;

  score += elements.balance;

  const yinyangBalance = 1 - Math.abs(yinyang.ratio - 0.5) * 2;
  score += yinyangBalance * 10;

  return Math.min(100, Math.max(0, Math.round(score)));
}
