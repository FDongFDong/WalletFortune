import { describe, it, expect } from 'vitest';
import {
  elementCoins,
  getRecommendedCoins,
  getCautionCoins,
  getElementCoins,
} from './matching';
import { Element } from '../fortune/types';

describe('elementCoins', () => {
  const elements: Element[] = ['water', 'wood', 'fire', 'earth', 'metal'];

  it('should have coins for all elements', () => {
    elements.forEach((element) => {
      expect(elementCoins[element]).toBeDefined();
      expect(elementCoins[element].length).toBeGreaterThan(0);
    });
  });

  it('should have valid coin structure', () => {
    elements.forEach((element) => {
      elementCoins[element].forEach((coin) => {
        expect(coin).toHaveProperty('id');
        expect(coin).toHaveProperty('symbol');
        expect(coin).toHaveProperty('name');
        expect(typeof coin.id).toBe('string');
        expect(typeof coin.symbol).toBe('string');
        expect(typeof coin.name).toBe('string');
      });
    });
  });

  describe('element-coin mapping', () => {
    it('water should have DeFi/DEX coins', () => {
      const waterCoins = elementCoins.water.map((c) => c.symbol);
      expect(waterCoins).toContain('UNI');
      expect(waterCoins).toContain('AAVE');
    });

    it('wood should have Layer2/new coins', () => {
      const woodCoins = elementCoins.wood.map((c) => c.symbol);
      expect(woodCoins).toContain('ARB');
      expect(woodCoins).toContain('OP');
    });

    it('fire should have meme/game coins', () => {
      const fireCoins = elementCoins.fire.map((c) => c.symbol);
      expect(fireCoins).toContain('DOGE');
      expect(fireCoins).toContain('SHIB');
    });

    it('earth should have stable/major coins', () => {
      const earthCoins = elementCoins.earth.map((c) => c.symbol);
      expect(earthCoins).toContain('BTC');
      expect(earthCoins).toContain('ETH');
    });

    it('metal should have payment/RWA coins', () => {
      const metalCoins = elementCoins.metal.map((c) => c.symbol);
      expect(metalCoins).toContain('XRP');
      expect(metalCoins).toContain('LINK');
    });
  });
});

describe('getRecommendedCoins', () => {
  const elements: Element[] = ['water', 'wood', 'fire', 'earth', 'metal'];

  it('should return array of coin symbols', () => {
    elements.forEach((element) => {
      const coins = getRecommendedCoins(element);
      expect(Array.isArray(coins)).toBe(true);
      coins.forEach((coin) => {
        expect(typeof coin).toBe('string');
      });
    });
  });

  it('should return exactly 3 coins', () => {
    elements.forEach((element) => {
      const coins = getRecommendedCoins(element);
      expect(coins.length).toBe(3);
    });
  });

  it('should return first 3 coins from element', () => {
    elements.forEach((element) => {
      const recommended = getRecommendedCoins(element);
      const allCoins = elementCoins[element].slice(0, 3).map((c) => c.symbol);
      expect(recommended).toEqual(allCoins);
    });
  });
});

describe('getCautionCoins', () => {
  const elements: Element[] = ['water', 'wood', 'fire', 'earth', 'metal'];

  it('should return array of coin symbols', () => {
    elements.forEach((element) => {
      const coins = getCautionCoins(element);
      expect(Array.isArray(coins)).toBe(true);
      coins.forEach((coin) => {
        expect(typeof coin).toBe('string');
      });
    });
  });

  it('should return exactly 2 coins', () => {
    elements.forEach((element) => {
      const coins = getCautionCoins(element);
      expect(coins.length).toBe(2);
    });
  });

  it('should return first 2 coins from element', () => {
    elements.forEach((element) => {
      const caution = getCautionCoins(element);
      const allCoins = elementCoins[element].slice(0, 2).map((c) => c.symbol);
      expect(caution).toEqual(allCoins);
    });
  });
});

describe('getElementCoins', () => {
  const elements: Element[] = ['water', 'wood', 'fire', 'earth', 'metal'];

  it('should return full coin info for element', () => {
    elements.forEach((element) => {
      const coins = getElementCoins(element);
      expect(coins).toEqual(elementCoins[element]);
    });
  });

  it('should return at least 5 coins per element', () => {
    elements.forEach((element) => {
      const coins = getElementCoins(element);
      expect(coins.length).toBeGreaterThanOrEqual(5);
    });
  });
});
