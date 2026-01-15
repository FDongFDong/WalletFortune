import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export interface GeneratedWallet {
  address: string;
  privateKey: string;
}

export function generateWallet(): GeneratedWallet {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey: privateKey,
  };
}

export function downloadWalletJson(wallet: GeneratedWallet, fortune?: any): void {
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

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wallet-${wallet.address.slice(0, 8)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
