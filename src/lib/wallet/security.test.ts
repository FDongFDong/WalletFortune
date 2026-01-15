/**
 * Wallet Generator Security Tests
 * 지갑 생성 보안 테스트
 */

import { describe, it, expect } from 'vitest';
import { generateWallet } from './generator';
import { isAddress, getAddress } from 'viem';

describe('Wallet Generator Security', () => {
  describe('Key Generation', () => {
    it('should generate valid Ethereum address', () => {
      const wallet = generateWallet();

      expect(isAddress(wallet.address)).toBe(true);
    });

    it('should generate EIP-55 checksummed address', () => {
      const wallet = generateWallet();

      // Checksum address should equal itself when checksummed
      expect(wallet.address).toBe(getAddress(wallet.address));
    });

    it('should generate 64-character private key (excluding 0x)', () => {
      const wallet = generateWallet();

      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should generate unique wallets each time', () => {
      const wallets = Array.from({ length: 100 }, () => generateWallet());
      const addresses = wallets.map((w) => w.address);
      const privateKeys = wallets.map((w) => w.privateKey);

      // All addresses should be unique
      const uniqueAddresses = new Set(addresses);
      expect(uniqueAddresses.size).toBe(100);

      // All private keys should be unique
      const uniquePrivateKeys = new Set(privateKeys);
      expect(uniquePrivateKeys.size).toBe(100);
    });

    it('should not generate predictable patterns', () => {
      const wallets = Array.from({ length: 50 }, () => generateWallet());

      // Check that addresses don't follow a pattern
      for (let i = 1; i < wallets.length; i++) {
        expect(wallets[i].address).not.toBe(wallets[i - 1].address);
        expect(wallets[i].privateKey).not.toBe(wallets[i - 1].privateKey);
      }
    });

    it('should generate addresses starting with 0x', () => {
      const wallet = generateWallet();

      expect(wallet.address.startsWith('0x')).toBe(true);
      expect(wallet.privateKey.startsWith('0x')).toBe(true);
    });
  });

  describe('Private Key Security', () => {
    it('should generate non-zero private key', () => {
      const wallets = Array.from({ length: 100 }, () => generateWallet());

      wallets.forEach((wallet) => {
        const keyWithout0x = wallet.privateKey.slice(2);
        expect(keyWithout0x).not.toBe('0'.repeat(64));
      });
    });

    it('should generate keys within valid range', () => {
      const wallets = Array.from({ length: 100 }, () => generateWallet());

      wallets.forEach((wallet) => {
        const keyBigInt = BigInt(wallet.privateKey);
        // secp256k1 curve order
        const curveOrder = BigInt(
          '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'
        );

        expect(keyBigInt > 0n).toBe(true);
        expect(keyBigInt < curveOrder).toBe(true);
      });
    });
  });

  describe('Address Derivation', () => {
    it('should derive address from private key correctly', async () => {
      const { privateKeyToAccount } = await import('viem/accounts');
      const wallet = generateWallet();

      const derivedAccount = privateKeyToAccount(wallet.privateKey as `0x${string}`);

      expect(derivedAccount.address).toBe(wallet.address);
    });
  });
});
