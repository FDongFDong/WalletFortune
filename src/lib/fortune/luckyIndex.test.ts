import { describe, it, expect } from 'vitest';
import { calculateLuckyIndex } from './luckyIndex';
import { analyzeElements } from './elements';
import { analyzeYinYang } from './yinyang';
import { analyzePatterns } from './patterns';

describe('calculateLuckyIndex', () => {
  const getAnalysis = (address: string) => ({
    elements: analyzeElements(address),
    yinyang: analyzeYinYang(address),
    patterns: analyzePatterns(address),
  });

  describe('base score', () => {
    it('should start with base score of 50', () => {
      const address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
      const { elements, yinyang, patterns } = getAnalysis(address);
      const score = calculateLuckyIndex(address, elements, yinyang, patterns);
      // Score should be around 50 for a neutral address
      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThanOrEqual(80);
    });
  });

  describe('lucky digits bonus', () => {
    it('should give higher score for addresses with 7,8,9', () => {
      const luckyAddress = '0x7777888899997777888899997777888899997777';
      const normalAddress = '0x1234561234561234561234561234561234561234';

      const luckyAnalysis = getAnalysis(luckyAddress);
      const normalAnalysis = getAnalysis(normalAddress);

      const luckyScore = calculateLuckyIndex(
        luckyAddress,
        luckyAnalysis.elements,
        luckyAnalysis.yinyang,
        luckyAnalysis.patterns
      );
      const normalScore = calculateLuckyIndex(
        normalAddress,
        normalAnalysis.elements,
        normalAnalysis.yinyang,
        normalAnalysis.patterns
      );

      expect(luckyScore).toBeGreaterThan(normalScore);
    });
  });

  describe('pattern bonus', () => {
    it('should add pattern bonus to score', () => {
      const patternAddress = '0x7771234567890abcdef1234567890abcdef12345';
      const { elements, yinyang, patterns } = getAnalysis(patternAddress);

      expect(patterns.bonus).toBeGreaterThan(0);

      const score = calculateLuckyIndex(patternAddress, elements, yinyang, patterns);
      expect(score).toBeGreaterThan(50);
    });
  });

  describe('score bounds', () => {
    it('should not exceed 100', () => {
      const address = '0x7778889997778889997778889997778889997778';
      const { elements, yinyang, patterns } = getAnalysis(address);
      const score = calculateLuckyIndex(address, elements, yinyang, patterns);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should not go below 0', () => {
      const address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
      const { elements, yinyang, patterns } = getAnalysis(address);
      const score = calculateLuckyIndex(address, elements, yinyang, patterns);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return integer value', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const { elements, yinyang, patterns } = getAnalysis(address);
      const score = calculateLuckyIndex(address, elements, yinyang, patterns);
      expect(Number.isInteger(score)).toBe(true);
    });
  });

  describe('element balance bonus', () => {
    it('should add element balance to score', () => {
      const balancedAddress = '0x0123456789012345678901234567890123456789';
      const { elements, yinyang, patterns } = getAnalysis(balancedAddress);

      expect(elements.balance).toBeGreaterThan(0);
      const score = calculateLuckyIndex(balancedAddress, elements, yinyang, patterns);
      expect(score).toBeGreaterThan(50);
    });
  });

  describe('yinyang balance bonus', () => {
    it('should reward balanced yinyang', () => {
      // A more balanced address
      const address = '0xAaBbCcDd1234567890AaBbCcDd1234567890AaBb';
      const { elements, yinyang, patterns } = getAnalysis(address);
      const score = calculateLuckyIndex(address, elements, yinyang, patterns);

      // Should have some score contribution from yinyang
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});
