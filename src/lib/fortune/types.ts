/**
 * Fortune Analysis Types
 * 지갑 주소 기반 운세 분석을 위한 타입 정의
 */

/** 투자 성향 타입 - 주소의 첫 번째 문자 기반 */
export type PersonalityType = 'holder' | 'balanced' | 'aggressive' | 'analyst' | 'degen';

/** 오행 (Five Elements) - 동아시아 철학의 5가지 원소 */
export type Element = 'water' | 'wood' | 'fire' | 'earth' | 'metal';

/** 음양 타입 */
export type YinYang = 'yin' | 'yang' | 'balanced';

/** 특수 패턴 타입 - 행운의 숫자 조합 */
export type PatternType = 'lucky777' | 'lucky888' | 'quadruple' | 'rare' | 'symmetric' | 'none';

/** 오행 분석 결과 */
export interface ElementAnalysis {
  /** 각 원소별 카운트 */
  counts: Record<Element, number>;
  /** 주요 원소 (가장 많은) */
  mainElement: Element;
  /** 약한 원소 (가장 적은) */
  weakElement: Element;
  /** 균형 점수 (0-100) */
  balance: number;
}

/** 음양 분석 결과 */
export interface YinYangAnalysis {
  /** 음양 타입 */
  type: YinYang;
  /** 양 문자 개수 */
  yangCount: number;
  /** 음 문자 개수 */
  yinCount: number;
  /** 양/음 비율 */
  ratio: number;
}

/** 패턴 분석 결과 */
export interface PatternAnalysis {
  /** 발견된 패턴들 */
  patterns: PatternType[];
  /** 패턴 보너스 점수 */
  bonus: number;
}

/** 전체 운세 분석 결과 */
export interface FortuneResult {
  /** 원본 주소 */
  address: string;
  /** 체크섬 주소 (EIP-55) */
  checksumAddress: string;
  /** 투자 성향 */
  personality: PersonalityType;
  /** 오행 분석 */
  elements: ElementAnalysis;
  /** 음양 분석 */
  yinyang: YinYangAnalysis;
  /** 패턴 분석 */
  patterns: PatternAnalysis;
  /** 행운 지수 (0-100) */
  luckyIndex: number;
  /** 추천 코인 심볼 */
  recommendedCoins: string[];
  /** 주의 코인 심볼 */
  cautionCoins: string[];
}

/** CoinGecko API 코인 정보 */
export interface CoinInfo {
  /** 코인 ID */
  id: string;
  /** 코인 심볼 */
  symbol: string;
  /** 코인 이름 */
  name: string;
  /** 이미지 URL */
  image?: string;
  /** 현재 가격 (USD) */
  current_price?: number;
  /** 24시간 가격 변동률 */
  price_change_percentage_24h?: number;
}
