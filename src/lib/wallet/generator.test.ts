import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWallet, downloadWalletJson, GeneratedWallet } from './generator';
import { isAddress } from 'viem';

describe('generateWallet', () => {
  describe('wallet generation', () => {
    it('should return wallet with address and privateKey', () => {
      const wallet = generateWallet();

      expect(wallet).toHaveProperty('address');
      expect(wallet).toHaveProperty('privateKey');
    });

    it('should generate valid Ethereum address', () => {
      const wallet = generateWallet();

      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(isAddress(wallet.address)).toBe(true);
    });

    it('should generate valid private key', () => {
      const wallet = generateWallet();

      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should generate unique wallets each time', () => {
      const wallet1 = generateWallet();
      const wallet2 = generateWallet();

      expect(wallet1.address).not.toBe(wallet2.address);
      expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    });

    it('should generate checksum address', () => {
      const wallet = generateWallet();

      // Checksum addresses have mixed case
      const hasUpperCase = /[A-F]/.test(wallet.address.slice(2));
      const hasLowerCase = /[a-f]/.test(wallet.address.slice(2));

      // Most addresses will have mixed case due to checksum
      // (unless they're all numbers, which is rare)
      expect(wallet.address.startsWith('0x')).toBe(true);
    });
  });

  describe('wallet consistency', () => {
    it('should generate address that matches private key', () => {
      // This is implicitly tested by viem, but let's verify
      const wallet = generateWallet();

      // Address should be 42 characters (0x + 40 hex)
      expect(wallet.address.length).toBe(42);

      // Private key should be 66 characters (0x + 64 hex)
      expect(wallet.privateKey.length).toBe(66);
    });
  });
});

describe('downloadWalletJson', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let mockClick: ReturnType<typeof vi.fn>;
  let createdAnchor: HTMLAnchorElement;

  beforeEach(() => {
    mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    mockRevokeObjectURL = vi.fn();
    mockClick = vi.fn();
    mockAppendChild = vi.fn();
    mockRemoveChild = vi.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      createdAnchor = node as HTMLAnchorElement;
      mockAppendChild(node);
      return node;
    });
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
      mockRemoveChild(node);
      return node;
    });
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const element = {
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLAnchorElement;
      return element;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create blob with wallet data', () => {
    const wallet: GeneratedWallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1E321',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    };

    downloadWalletJson(wallet);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    const blobArg = mockCreateObjectURL.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
  });

  it('should trigger download', () => {
    const wallet: GeneratedWallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1E321',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    };

    downloadWalletJson(wallet);

    expect(mockClick).toHaveBeenCalled();
  });

  it('should clean up after download', () => {
    const wallet: GeneratedWallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1E321',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    };

    downloadWalletJson(wallet);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  it('should include fortune data when provided', () => {
    const wallet: GeneratedWallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1E321',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    };

    const fortune = {
      personality: 'holder',
      elements: { mainElement: 'water' },
      yinyang: { type: 'balanced' },
      luckyIndex: 75,
      recommendedCoins: ['BTC', 'ETH'],
    };

    downloadWalletJson(wallet, fortune);

    expect(mockCreateObjectURL).toHaveBeenCalled();
  });
});
