import { describe, it, expect } from 'vitest';
import { analyzePersonality } from './personality';

describe('analyzePersonality', () => {
  describe('holder type (0-3)', () => {
    it('should return holder for address starting with 0', () => {
      expect(analyzePersonality('0x0abc123456789abcdef0123456789abcdef012345')).toBe('holder');
    });

    it('should return holder for address starting with 1', () => {
      expect(analyzePersonality('0x1abc123456789abcdef0123456789abcdef012345')).toBe('holder');
    });

    it('should return holder for address starting with 2', () => {
      expect(analyzePersonality('0x2abc123456789abcdef0123456789abcdef012345')).toBe('holder');
    });

    it('should return holder for address starting with 3', () => {
      expect(analyzePersonality('0x3abc123456789abcdef0123456789abcdef012345')).toBe('holder');
    });
  });

  describe('balanced type (4-7)', () => {
    it('should return balanced for address starting with 4', () => {
      expect(analyzePersonality('0x4abc123456789abcdef0123456789abcdef012345')).toBe('balanced');
    });

    it('should return balanced for address starting with 5', () => {
      expect(analyzePersonality('0x5abc123456789abcdef0123456789abcdef012345')).toBe('balanced');
    });

    it('should return balanced for address starting with 6', () => {
      expect(analyzePersonality('0x6abc123456789abcdef0123456789abcdef012345')).toBe('balanced');
    });

    it('should return balanced for address starting with 7', () => {
      expect(analyzePersonality('0x7abc123456789abcdef0123456789abcdef012345')).toBe('balanced');
    });
  });

  describe('aggressive type (8-9)', () => {
    it('should return aggressive for address starting with 8', () => {
      expect(analyzePersonality('0x8abc123456789abcdef0123456789abcdef012345')).toBe('aggressive');
    });

    it('should return aggressive for address starting with 9', () => {
      expect(analyzePersonality('0x9abc123456789abcdef0123456789abcdef012345')).toBe('aggressive');
    });
  });

  describe('analyst type (a-c)', () => {
    it('should return analyst for address starting with a', () => {
      expect(analyzePersonality('0xaabc123456789abcdef0123456789abcdef012345')).toBe('analyst');
    });

    it('should return analyst for address starting with b', () => {
      expect(analyzePersonality('0xbabc123456789abcdef0123456789abcdef012345')).toBe('analyst');
    });

    it('should return analyst for address starting with c', () => {
      expect(analyzePersonality('0xcabc123456789abcdef0123456789abcdef012345')).toBe('analyst');
    });

    it('should handle uppercase letters', () => {
      expect(analyzePersonality('0xAabc123456789abcdef0123456789abcdef012345')).toBe('analyst');
    });
  });

  describe('degen type (d-f)', () => {
    it('should return degen for address starting with d', () => {
      expect(analyzePersonality('0xdabc123456789abcdef0123456789abcdef012345')).toBe('degen');
    });

    it('should return degen for address starting with e', () => {
      expect(analyzePersonality('0xeabc123456789abcdef0123456789abcdef012345')).toBe('degen');
    });

    it('should return degen for address starting with f', () => {
      expect(analyzePersonality('0xfabc123456789abcdef0123456789abcdef012345')).toBe('degen');
    });
  });
});
