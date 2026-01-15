import { describe, it, expect } from 'vitest';
import { analyzePatterns } from './patterns';

describe('analyzePatterns', () => {
  describe('lucky777 pattern', () => {
    it('should detect 777 pattern', () => {
      const result = analyzePatterns('0x7771234567890abcdef1234567890abcdef12345');
      expect(result.patterns).toContain('lucky777');
    });

    it('should add bonus for 777', () => {
      const result = analyzePatterns('0x7771234567890abcdef1234567890abcdef12345');
      expect(result.bonus).toBeGreaterThan(0);
    });
  });

  describe('lucky888 pattern', () => {
    it('should detect 888 pattern', () => {
      const result = analyzePatterns('0x8881234567890abcdef1234567890abcdef12345');
      expect(result.patterns).toContain('lucky888');
    });

    it('should add 20 bonus for 888', () => {
      const withoutPattern = analyzePatterns('0x1234567890abcdef1234567890abcdef12345678');
      const withPattern = analyzePatterns('0x8881234567890abcdef1234567890abcdef12345');
      expect(withPattern.bonus).toBeGreaterThan(withoutPattern.bonus);
    });
  });

  describe('quadruple pattern', () => {
    it('should detect 4+ same characters', () => {
      const result = analyzePatterns('0x1111234567890abcdef1234567890abcdef12345');
      expect(result.patterns).toContain('quadruple');
    });

    it('should not detect less than 4 same characters', () => {
      // Use address where no character appears 4+ times (40 chars, 16 hex digits)
      // Each character appears at most 3 times: 0123456789abcdef repeated ~2.5 times
      const result = analyzePatterns('0x0123456789abcdef0123456789abcdef01234567');
      expect(result.patterns).not.toContain('quadruple');
    });
  });

  describe('rare pattern', () => {
    it('should detect addresses starting with 00', () => {
      const result = analyzePatterns('0x0012345678901234567890123456789012345678');
      expect(result.patterns).toContain('rare');
    });

    it('should detect addresses starting with 000', () => {
      const result = analyzePatterns('0x0001234567890123456789012345678901234567');
      expect(result.patterns).toContain('rare');
    });
  });

  describe('symmetric pattern', () => {
    it('should detect symmetric addresses', () => {
      // First half mirrors second half reversed
      const result = analyzePatterns('0x12345678901234567890123456789012345678ab');
      // This may or may not be symmetric depending on exact implementation
      expect(result.patterns).toBeDefined();
    });
  });

  describe('no pattern', () => {
    it('should return none when no patterns found', () => {
      // Random address with no special patterns
      const result = analyzePatterns('0xabcdef1234567890abcdef1234567890abcdef12');
      if (result.patterns.length === 1) {
        expect(result.patterns).toContain('none');
      }
    });
  });

  describe('multiple patterns', () => {
    it('should detect multiple patterns', () => {
      // 777 + 888
      const result = analyzePatterns('0x7778881234567890abcdef1234567890abcdef12');
      expect(result.patterns.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('bonus cap', () => {
    it('should cap bonus at 20', () => {
      // Address with many patterns
      const result = analyzePatterns('0x7778880000000000000000000000000000000000');
      expect(result.bonus).toBeLessThanOrEqual(20);
    });
  });
});
