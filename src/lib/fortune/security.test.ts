/**
 * Security Tests
 * 보안 관련 테스트 - XSS, 입력 검증, 경계값 테스트
 */

import { describe, it, expect } from 'vitest';
import { analyzeWallet } from './analyzer';
import { analyzePersonality } from './personality';
import { analyzeElements } from './elements';
import { analyzeYinYang } from './yinyang';
import { analyzePatterns } from './patterns';

describe('Security Tests', () => {
  describe('Input Validation', () => {
    it('should reject XSS attack strings', () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '"><script>alert(1)</script>',
        "'; DROP TABLE users;--",
        '${alert(1)}',
        '{{constructor.constructor("alert(1)")()}}',
      ];

      xssPayloads.forEach((payload) => {
        expect(analyzeWallet(payload)).toBeNull();
      });
    });

    it('should reject empty and null-like inputs', () => {
      expect(analyzeWallet('')).toBeNull();
      expect(analyzeWallet('   ')).toBeNull();
      expect(analyzeWallet('null')).toBeNull();
      expect(analyzeWallet('undefined')).toBeNull();
    });

    it('should reject invalid hex characters', () => {
      expect(analyzeWallet('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBeNull();
      expect(analyzeWallet('0x!@#$%^&*()_+-=[]{}|;:,.<>?')).toBeNull();
    });

    it('should reject addresses with wrong length', () => {
      expect(analyzeWallet('0x123')).toBeNull();
      expect(analyzeWallet('0x' + '1'.repeat(39))).toBeNull();
      expect(analyzeWallet('0x' + '1'.repeat(41))).toBeNull();
    });

    it('should reject addresses without 0x prefix', () => {
      expect(analyzeWallet('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBeNull();
    });

    it('should accept valid addresses', () => {
      const validAddresses = [
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        '0x0000000000000000000000000000000000000000',
        '0xffffffffffffffffffffffffffffffffffffffff',
      ];

      validAddresses.forEach((address) => {
        expect(analyzeWallet(address)).not.toBeNull();
      });
    });
  });

  describe('Output Safety', () => {
    it('should return safe string values (no HTML)', () => {
      const result = analyzeWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

      expect(result?.address).not.toContain('<');
      expect(result?.address).not.toContain('>');
      expect(result?.checksumAddress).not.toContain('<');
      expect(result?.personality).not.toContain('<');
    });

    it('should return checksummed addresses only', () => {
      const result = analyzeWallet('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

      // EIP-55 checksum address has mixed case
      expect(result?.checksumAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should return bounded luckyIndex', () => {
      const testAddresses = [
        '0x0000000000000000000000000000000000000000',
        '0x7777777777777777777777777777777777777777',
        '0x8888888888888888888888888888888888888888',
        '0x9999999999999999999999999999999999999999',
        '0xffffffffffffffffffffffffffffffffffffffff',
      ];

      testAddresses.forEach((address) => {
        const result = analyzeWallet(address);
        expect(result?.luckyIndex).toBeGreaterThanOrEqual(0);
        expect(result?.luckyIndex).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Determinism', () => {
    it('should return identical results for same input', () => {
      const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

      const results = Array.from({ length: 10 }, () => analyzeWallet(address));

      results.forEach((result, i) => {
        if (i > 0) {
          expect(result?.personality).toBe(results[0]?.personality);
          expect(result?.luckyIndex).toBe(results[0]?.luckyIndex);
          expect(result?.elements.mainElement).toBe(results[0]?.elements.mainElement);
        }
      });
    });

    it('should be case-insensitive for same address', () => {
      const lower = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
      const mixed = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

      const resultLower = analyzeWallet(lower);
      const resultMixed = analyzeWallet(mixed);

      expect(resultLower?.personality).toBe(resultMixed?.personality);
      expect(resultLower?.luckyIndex).toBe(resultMixed?.luckyIndex);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all-zero address', () => {
      const result = analyzeWallet('0x0000000000000000000000000000000000000000');

      expect(result).not.toBeNull();
      expect(result?.elements.mainElement).toBe('water');
      expect(result?.patterns.patterns).toContain('rare');
    });

    it('should handle all-f address', () => {
      const result = analyzeWallet('0xffffffffffffffffffffffffffffffffffffffff');

      expect(result).not.toBeNull();
    });

    it('should handle all same digit addresses', () => {
      const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

      digits.forEach((d) => {
        const address = '0x' + d.repeat(40);
        const result = analyzeWallet(address);
        expect(result).not.toBeNull();
        expect(result?.patterns.patterns).toContain('quadruple');
      });
    });
  });
});

describe('Individual Module Security', () => {
  describe('analyzePersonality', () => {
    it('should handle malformed input gracefully', () => {
      // Should not throw
      expect(() => analyzePersonality('')).not.toThrow();
      expect(() => analyzePersonality('invalid')).not.toThrow();
    });

    it('should return valid type for any hex input', () => {
      const types = ['holder', 'balanced', 'aggressive', 'analyst', 'degen'];

      for (let i = 0; i < 16; i++) {
        const char = i.toString(16);
        const address = `0x${char}${'0'.repeat(39)}`;
        const result = analyzePersonality(address);
        expect(types).toContain(result);
      }
    });
  });

  describe('analyzeElements', () => {
    it('should count only digits 0-9', () => {
      const result = analyzeElements('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');

      // a-f should not be counted
      const totalCounted = Object.values(result.counts).reduce((a, b) => a + b, 0);
      expect(totalCounted).toBe(0);
    });

    it('should handle address with no digits', () => {
      const result = analyzeElements('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');

      expect(result.mainElement).toBeDefined();
      expect(result.weakElement).toBeDefined();
    });
  });

  describe('analyzeYinYang', () => {
    it('should handle address with no letters', () => {
      const result = analyzeYinYang('0x1234567890123456789012345678901234567890');

      expect(result.yangCount).toBe(0);
      expect(result.yinCount).toBe(0);
      expect(result.ratio).toBe(0.5);
    });

    it('should correctly identify uppercase as yang', () => {
      const result = analyzeYinYang('0xABCDEF0000000000000000000000000000000000');

      expect(result.yangCount).toBeGreaterThan(0);
    });
  });

  describe('analyzePatterns', () => {
    it('should cap bonus at maximum', () => {
      // Address with multiple patterns
      const result = analyzePatterns('0x7778880000000000000000000000000000000000');

      expect(result.bonus).toBeLessThanOrEqual(20);
    });

    it('should detect overlapping patterns correctly', () => {
      // 777 and 888 together
      const result = analyzePatterns('0x7778880000000000000000000000000000000000');

      expect(result.patterns).toContain('lucky777');
      expect(result.patterns).toContain('lucky888');
    });
  });
});
