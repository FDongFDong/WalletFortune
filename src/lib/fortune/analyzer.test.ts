import { describe, it, expect } from 'vitest';
import { analyzeWallet } from './analyzer';

describe('analyzeWallet', () => {
  // Use a properly checksummed address
  const validAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const invalidAddress = '0xinvalid';

  describe('input validation', () => {
    it('should return null for invalid address', () => {
      expect(analyzeWallet(invalidAddress)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(analyzeWallet('')).toBeNull();
    });

    it('should return null for non-hex string', () => {
      expect(analyzeWallet('not-an-address')).toBeNull();
    });

    it('should return result for valid address', () => {
      expect(analyzeWallet(validAddress)).not.toBeNull();
    });

    it('should accept lowercase addresses', () => {
      const lowercase = validAddress.toLowerCase();
      expect(analyzeWallet(lowercase)).not.toBeNull();
    });

    it('should accept all lowercase addresses', () => {
      // viem accepts lowercase addresses (non-checksummed)
      const lowercase = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
      expect(analyzeWallet(lowercase)).not.toBeNull();
    });
  });

  describe('result structure', () => {
    it('should return all required fields', () => {
      const result = analyzeWallet(validAddress);

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('checksumAddress');
      expect(result).toHaveProperty('personality');
      expect(result).toHaveProperty('elements');
      expect(result).toHaveProperty('yinyang');
      expect(result).toHaveProperty('patterns');
      expect(result).toHaveProperty('luckyIndex');
      expect(result).toHaveProperty('recommendedCoins');
      expect(result).toHaveProperty('cautionCoins');
    });

    it('should return original address', () => {
      const result = analyzeWallet(validAddress);
      expect(result?.address).toBe(validAddress);
    });

    it('should return checksum address', () => {
      const result = analyzeWallet(validAddress.toLowerCase());
      expect(result?.checksumAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('personality analysis', () => {
    it('should return valid personality type', () => {
      const result = analyzeWallet(validAddress);
      expect(['holder', 'balanced', 'aggressive', 'analyst', 'degen']).toContain(
        result?.personality
      );
    });
  });

  describe('elements analysis', () => {
    it('should return elements with counts', () => {
      const result = analyzeWallet(validAddress);

      expect(result?.elements).toHaveProperty('counts');
      expect(result?.elements).toHaveProperty('mainElement');
      expect(result?.elements).toHaveProperty('weakElement');
      expect(result?.elements).toHaveProperty('balance');
    });

    it('should return valid element types', () => {
      const result = analyzeWallet(validAddress);
      const elements = ['water', 'wood', 'fire', 'earth', 'metal'];

      expect(elements).toContain(result?.elements.mainElement);
      expect(elements).toContain(result?.elements.weakElement);
    });
  });

  describe('yinyang analysis', () => {
    it('should return yinyang with type', () => {
      const result = analyzeWallet(validAddress);

      expect(result?.yinyang).toHaveProperty('type');
      expect(result?.yinyang).toHaveProperty('yangCount');
      expect(result?.yinyang).toHaveProperty('yinCount');
      expect(result?.yinyang).toHaveProperty('ratio');
    });

    it('should return valid yinyang type', () => {
      const result = analyzeWallet(validAddress);
      expect(['yang', 'yin', 'balanced']).toContain(result?.yinyang.type);
    });
  });

  describe('patterns analysis', () => {
    it('should return patterns array', () => {
      const result = analyzeWallet(validAddress);

      expect(result?.patterns).toHaveProperty('patterns');
      expect(result?.patterns).toHaveProperty('bonus');
      expect(Array.isArray(result?.patterns.patterns)).toBe(true);
    });
  });

  describe('lucky index', () => {
    it('should return number between 0 and 100', () => {
      const result = analyzeWallet(validAddress);

      expect(result?.luckyIndex).toBeGreaterThanOrEqual(0);
      expect(result?.luckyIndex).toBeLessThanOrEqual(100);
    });

    it('should return integer', () => {
      const result = analyzeWallet(validAddress);
      expect(Number.isInteger(result?.luckyIndex)).toBe(true);
    });
  });

  describe('coin recommendations', () => {
    it('should return recommended coins array', () => {
      const result = analyzeWallet(validAddress);

      expect(Array.isArray(result?.recommendedCoins)).toBe(true);
      expect(result?.recommendedCoins.length).toBeGreaterThan(0);
    });

    it('should return caution coins array', () => {
      const result = analyzeWallet(validAddress);

      expect(Array.isArray(result?.cautionCoins)).toBe(true);
      expect(result?.cautionCoins.length).toBeGreaterThan(0);
    });

    it('should return coin symbols as strings', () => {
      const result = analyzeWallet(validAddress);

      result?.recommendedCoins.forEach((coin) => {
        expect(typeof coin).toBe('string');
      });
    });
  });

  describe('determinism', () => {
    it('should return same result for same address', () => {
      const result1 = analyzeWallet(validAddress);
      const result2 = analyzeWallet(validAddress);

      expect(result1?.personality).toBe(result2?.personality);
      expect(result1?.luckyIndex).toBe(result2?.luckyIndex);
      expect(result1?.elements.mainElement).toBe(result2?.elements.mainElement);
    });
  });
});
