export type PersonalityType = 'holder' | 'balanced' | 'aggressive' | 'analyst' | 'degen';

export type Element = 'water' | 'wood' | 'fire' | 'earth' | 'metal';

export type YinYang = 'yin' | 'yang' | 'balanced';

export type PatternType = 'lucky777' | 'lucky888' | 'quadruple' | 'rare' | 'symmetric' | 'none';

export interface ElementAnalysis {
  counts: Record<Element, number>;
  mainElement: Element;
  weakElement: Element;
  balance: number;
}

export interface YinYangAnalysis {
  type: YinYang;
  yangCount: number;
  yinCount: number;
  ratio: number;
}

export interface PatternAnalysis {
  patterns: PatternType[];
  bonus: number;
}

export interface FortuneResult {
  address: string;
  checksumAddress: string;
  personality: PersonalityType;
  elements: ElementAnalysis;
  yinyang: YinYangAnalysis;
  patterns: PatternAnalysis;
  luckyIndex: number;
  recommendedCoins: string[];
  cautionCoins: string[];
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
}
