import { describe, it, expect } from 'vitest';
import { analyzeElements } from './elements';

describe('analyzeElements', () => {
  describe('element counting', () => {
    it('should count water elements (0, 1)', () => {
      const result = analyzeElements('0x0011111111111111111111111111111111111111');
      expect(result.counts.water).toBeGreaterThan(0);
    });

    it('should count wood elements (2, 3)', () => {
      const result = analyzeElements('0x2233333333333333333333333333333333333333');
      expect(result.counts.wood).toBeGreaterThan(0);
    });

    it('should count fire elements (4, 5)', () => {
      const result = analyzeElements('0x4455555555555555555555555555555555555555');
      expect(result.counts.fire).toBeGreaterThan(0);
    });

    it('should count earth elements (6, 7)', () => {
      const result = analyzeElements('0x6677777777777777777777777777777777777777');
      expect(result.counts.earth).toBeGreaterThan(0);
    });

    it('should count metal elements (8, 9)', () => {
      const result = analyzeElements('0x8899999999999999999999999999999999999999');
      expect(result.counts.metal).toBeGreaterThan(0);
    });

    it('should not count hex letters as elements', () => {
      const result = analyzeElements('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');
      expect(result.counts.water).toBe(0);
      expect(result.counts.wood).toBe(0);
      expect(result.counts.fire).toBe(0);
      expect(result.counts.earth).toBe(0);
      expect(result.counts.metal).toBe(0);
    });
  });

  describe('main element detection', () => {
    it('should detect water as main element when 0,1 are dominant', () => {
      const result = analyzeElements('0x0000111111000011110000111100001111000011');
      expect(result.mainElement).toBe('water');
    });

    it('should detect metal as main element when 8,9 are dominant', () => {
      const result = analyzeElements('0x8888999999888899998888999988889999888899');
      expect(result.mainElement).toBe('metal');
    });
  });

  describe('weak element detection', () => {
    it('should detect the element with lowest count as weak', () => {
      // Address with no 8,9 (metal) but has other digits
      const result = analyzeElements('0x0123456701234567012345670123456701234567');
      expect(result.weakElement).toBe('metal');
    });
  });

  describe('balance calculation', () => {
    it('should return high balance for evenly distributed elements', () => {
      // Mix of all digit types
      const result = analyzeElements('0x0123456789012345678901234567890123456789');
      expect(result.balance).toBeGreaterThan(5);
    });

    it('should return low balance for concentrated elements', () => {
      // Only 0s and 1s
      const result = analyzeElements('0x0000000000000000000000000000000000000000');
      expect(result.balance).toBeLessThan(5);
    });

    it('should return balance between 0 and 10', () => {
      const result = analyzeElements('0x1234567890abcdef1234567890abcdef12345678');
      expect(result.balance).toBeGreaterThanOrEqual(0);
      expect(result.balance).toBeLessThanOrEqual(10);
    });
  });
});
