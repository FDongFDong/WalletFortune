/**
 * Wallet Generator
 * viem 라이브러리를 사용한 안전한 이더리움 지갑 생성 모듈
 */

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { FortuneResult } from '../fortune/types';

/** 생성된 지갑 정보 */
export interface GeneratedWallet {
  /** EIP-55 체크섬 주소 */
  address: string;
  /** 개인키 (0x 접두사 포함) */
  privateKey: string;
}

/**
 * 새로운 이더리움 지갑 생성
 * @returns GeneratedWallet - 주소와 개인키 쌍
 *
 * @description
 * viem의 generatePrivateKey를 사용하여 암호학적으로 안전한 개인키 생성
 * secp256k1 곡선 기반의 표준 이더리움 키페어
 */
export function generateWallet(): GeneratedWallet {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey: privateKey,
  };
}

/**
 * 지갑 정보를 JSON 파일로 다운로드
 * @param wallet - 생성된 지갑 정보
 * @param fortune - 운세 분석 결과 (선택사항)
 *
 * @description
 * Blob API를 사용하여 클라이언트 측에서 파일 다운로드
 * 메모리 누수 방지를 위해 URL.revokeObjectURL 호출
 */
export function downloadWalletJson(
  wallet: GeneratedWallet,
  fortune?: FortuneResult | null
): void {
  const data = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    fortune: fortune
      ? {
          personality: fortune.personality,
          mainElement: fortune.elements.mainElement,
          yinyang: fortune.yinyang.type,
          luckyIndex: fortune.luckyIndex,
          recommendedCoins: fortune.recommendedCoins,
        }
      : undefined,
    generatedAt: new Date().toISOString(),
    warning: 'Keep this file secure. Never share your private key.',
  };

  // Blob 생성 및 다운로드
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wallet-${wallet.address.slice(0, 8)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 메모리 해제
  URL.revokeObjectURL(url);
}
