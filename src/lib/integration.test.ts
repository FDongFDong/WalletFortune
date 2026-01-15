/**
 * Integration Tests
 * 전체 시스템 통합 테스트
 */

import { describe, it, expect } from 'vitest';
import { analyzeWallet } from './fortune/analyzer';
import { generateWallet } from './wallet/generator';
import { getRecommendedCoins, getCautionCoins, getElementCoins } from './coins/matching';

describe('Integration Tests', () => {
  describe('Full Flow: Generate and Analyze', () => {
    it('should generate wallet and analyze fortune successfully', () => {
      const wallet = generateWallet();
      const fortune = analyzeWallet(wallet.address);

      expect(fortune).not.toBeNull();
      expect(fortune?.address).toBe(wallet.address);
    });

    it('should produce consistent results for generated wallet', () => {
      const wallet = generateWallet();

      const fortune1 = analyzeWallet(wallet.address);
      const fortune2 = analyzeWallet(wallet.address);

      expect(fortune1).toEqual(fortune2);
    });

    it('should complete full flow multiple times without errors', () => {
      for (let i = 0; i < 50; i++) {
        const wallet = generateWallet();
        const fortune = analyzeWallet(wallet.address);

        expect(fortune).not.toBeNull();
        expect(fortune?.luckyIndex).toBeGreaterThanOrEqual(0);
        expect(fortune?.luckyIndex).toBeLessThanOrEqual(100);
        expect(fortune?.recommendedCoins.length).toBeGreaterThan(0);
        expect(fortune?.cautionCoins.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Element to Coin Mapping', () => {
    it('should return different coins for different elements', () => {
      const elements = ['water', 'wood', 'fire', 'earth', 'metal'] as const;
      const allCoins = new Set<string>();

      elements.forEach((element) => {
        const coins = getElementCoins(element);
        coins.forEach((coin) => allCoins.add(coin.symbol));
      });

      // Should have at least 20 unique coins (5 per element)
      expect(allCoins.size).toBeGreaterThanOrEqual(20);
    });

    it('should return valid coin symbols', () => {
      const elements = ['water', 'wood', 'fire', 'earth', 'metal'] as const;

      elements.forEach((element) => {
        const recommended = getRecommendedCoins(element);
        const caution = getCautionCoins(element);

        recommended.forEach((symbol) => {
          expect(symbol).toMatch(/^[A-Z]{2,10}$/);
        });

        caution.forEach((symbol) => {
          expect(symbol).toMatch(/^[A-Z]{2,10}$/);
        });
      });
    });
  });

  describe('Fortune Result Completeness', () => {
    it('should return all required fields', () => {
      const wallet = generateWallet();
      const fortune = analyzeWallet(wallet.address);

      expect(fortune).toHaveProperty('address');
      expect(fortune).toHaveProperty('checksumAddress');
      expect(fortune).toHaveProperty('personality');
      expect(fortune).toHaveProperty('elements');
      expect(fortune).toHaveProperty('yinyang');
      expect(fortune).toHaveProperty('patterns');
      expect(fortune).toHaveProperty('luckyIndex');
      expect(fortune).toHaveProperty('recommendedCoins');
      expect(fortune).toHaveProperty('cautionCoins');
    });

    it('should have valid nested structures', () => {
      const wallet = generateWallet();
      const fortune = analyzeWallet(wallet.address);

      // Elements
      expect(fortune?.elements).toHaveProperty('counts');
      expect(fortune?.elements).toHaveProperty('mainElement');
      expect(fortune?.elements).toHaveProperty('weakElement');
      expect(fortune?.elements).toHaveProperty('balance');

      // YinYang
      expect(fortune?.yinyang).toHaveProperty('type');
      expect(fortune?.yinyang).toHaveProperty('yangCount');
      expect(fortune?.yinyang).toHaveProperty('yinCount');
      expect(fortune?.yinyang).toHaveProperty('ratio');

      // Patterns
      expect(fortune?.patterns).toHaveProperty('patterns');
      expect(fortune?.patterns).toHaveProperty('bonus');
    });

    it('should have valid enum values', () => {
      const personalityTypes = ['holder', 'balanced', 'aggressive', 'analyst', 'degen'];
      const elements = ['water', 'wood', 'fire', 'earth', 'metal'];
      const yinyangTypes = ['yin', 'yang', 'balanced'];

      for (let i = 0; i < 100; i++) {
        const wallet = generateWallet();
        const fortune = analyzeWallet(wallet.address);

        expect(personalityTypes).toContain(fortune?.personality);
        expect(elements).toContain(fortune?.elements.mainElement);
        expect(elements).toContain(fortune?.elements.weakElement);
        expect(yinyangTypes).toContain(fortune?.yinyang.type);
      }
    });
  });

  describe('Known Address Tests', () => {
    const testCases = [
      {
        address: '0x0000000000000000000000000000000000000000',
        expectedPersonality: 'holder',
        expectedMainElement: 'water',
      },
      {
        address: '0x4444444444444444444444444444444444444444',
        expectedPersonality: 'balanced',
        expectedMainElement: 'fire',
      },
      {
        address: '0x8888888888888888888888888888888888888888',
        expectedPersonality: 'aggressive',
        expectedMainElement: 'metal',
      },
      {
        address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        expectedPersonality: 'analyst',
      },
      {
        address: '0xdddddddddddddddddddddddddddddddddddddddd',
        expectedPersonality: 'degen',
      },
    ];

    testCases.forEach(({ address, expectedPersonality, expectedMainElement }) => {
      it(`should correctly analyze ${address.slice(0, 10)}...`, () => {
        const fortune = analyzeWallet(address);

        expect(fortune?.personality).toBe(expectedPersonality);
        if (expectedMainElement) {
          expect(fortune?.elements.mainElement).toBe(expectedMainElement);
        }
      });
    });
  });

  describe('Performance', () => {
    it('should analyze wallet within reasonable time', () => {
      const start = Date.now();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        analyzeWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
      }

      const elapsed = Date.now() - start;
      const avgTime = elapsed / iterations;

      // Should take less than 1ms per analysis on average
      expect(avgTime).toBeLessThan(1);
    });

    it('should generate wallet within reasonable time', () => {
      const start = Date.now();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        generateWallet();
      }

      const elapsed = Date.now() - start;
      const avgTime = elapsed / iterations;

      // Should take less than 10ms per generation on average
      expect(avgTime).toBeLessThan(10);
    });
  });
});
