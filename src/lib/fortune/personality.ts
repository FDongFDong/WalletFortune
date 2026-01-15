import { PersonalityType } from './types';

export function analyzePersonality(address: string): PersonalityType {
  const cleanAddress = address.toLowerCase().replace('0x', '');
  const firstChar = cleanAddress[0];

  if (['0', '1', '2', '3'].includes(firstChar)) {
    return 'holder';
  } else if (['4', '5', '6', '7'].includes(firstChar)) {
    return 'balanced';
  } else if (['8', '9'].includes(firstChar)) {
    return 'aggressive';
  } else if (['a', 'b', 'c'].includes(firstChar)) {
    return 'analyst';
  } else {
    return 'degen';
  }
}
