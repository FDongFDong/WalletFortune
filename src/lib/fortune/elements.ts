import { Element, ElementAnalysis } from './types';

const digitToElement: Record<string, Element> = {
  '0': 'water',
  '1': 'water',
  '2': 'wood',
  '3': 'wood',
  '4': 'fire',
  '5': 'fire',
  '6': 'earth',
  '7': 'earth',
  '8': 'metal',
  '9': 'metal',
};

export function analyzeElements(address: string): ElementAnalysis {
  const cleanAddress = address.toLowerCase().replace('0x', '');

  const counts: Record<Element, number> = {
    water: 0,
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
  };

  for (const char of cleanAddress) {
    if (digitToElement[char]) {
      counts[digitToElement[char]]++;
    }
  }

  const elements: Element[] = ['water', 'wood', 'fire', 'earth', 'metal'];

  let mainElement: Element = 'earth';
  let maxCount = 0;
  let weakElement: Element = 'earth';
  let minCount = Infinity;

  for (const element of elements) {
    if (counts[element] > maxCount) {
      maxCount = counts[element];
      mainElement = element;
    }
    if (counts[element] < minCount) {
      minCount = counts[element];
      weakElement = element;
    }
  }

  const totalDigits = Object.values(counts).reduce((a, b) => a + b, 0);
  const avgCount = totalDigits / 5;
  const variance = elements.reduce((sum, el) => sum + Math.pow(counts[el] - avgCount, 2), 0) / 5;
  const balance = Math.max(0, 10 - Math.sqrt(variance));

  return {
    counts,
    mainElement,
    weakElement,
    balance,
  };
}
