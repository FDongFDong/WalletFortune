import { PatternAnalysis, PatternType } from './types';

export function analyzePatterns(address: string): PatternAnalysis {
  const cleanAddress = address.toLowerCase().replace('0x', '');
  const patterns: PatternType[] = [];
  let bonus = 0;

  if (cleanAddress.includes('777')) {
    patterns.push('lucky777');
    bonus += 15;
  }

  if (cleanAddress.includes('888')) {
    patterns.push('lucky888');
    bonus += 20;
  }

  const charCounts: Record<string, number> = {};
  for (const char of cleanAddress) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }

  for (const count of Object.values(charCounts)) {
    if (count >= 4) {
      if (!patterns.includes('quadruple')) {
        patterns.push('quadruple');
        bonus += 10;
      }
      break;
    }
  }

  if (cleanAddress.startsWith('00') || cleanAddress.startsWith('000')) {
    patterns.push('rare');
    bonus += 15;
  }

  const firstHalf = cleanAddress.slice(0, 20);
  const secondHalf = cleanAddress.slice(20).split('').reverse().join('');
  let matchCount = 0;
  for (let i = 0; i < 10; i++) {
    if (firstHalf[i] === secondHalf[i]) {
      matchCount++;
    }
  }
  if (matchCount >= 3) {
    patterns.push('symmetric');
    bonus += 5;
  }

  if (patterns.length === 0) {
    patterns.push('none');
  }

  return {
    patterns,
    bonus: Math.min(bonus, 20),
  };
}
