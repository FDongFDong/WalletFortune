import { YinYangAnalysis, YinYang } from './types';
import { getAddress, isAddress } from 'viem';

export function analyzeYinYang(address: string): YinYangAnalysis {
  let checksumAddress: string;

  try {
    if (isAddress(address)) {
      checksumAddress = getAddress(address);
    } else {
      checksumAddress = address;
    }
  } catch {
    checksumAddress = address;
  }

  const addressPart = checksumAddress.replace('0x', '');

  let yangCount = 0;
  let yinCount = 0;

  for (const char of addressPart) {
    if (char >= 'A' && char <= 'F') {
      yangCount++;
    } else if (char >= 'a' && char <= 'f') {
      yinCount++;
    }
  }

  const total = yangCount + yinCount;
  const ratio = total > 0 ? yangCount / total : 0.5;

  let type: YinYang;
  if (ratio > 0.6) {
    type = 'yang';
  } else if (ratio < 0.4) {
    type = 'yin';
  } else {
    type = 'balanced';
  }

  return {
    type,
    yangCount,
    yinCount,
    ratio,
  };
}
