import { create } from 'zustand';
import { FortuneResult } from '@/lib/fortune/types';
import { GeneratedWallet } from '@/lib/wallet/generator';

interface FortuneState {
  walletAddress: string;
  fortuneResult: FortuneResult | null;
  generatedWallet: GeneratedWallet | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  error: string | null;
  setWalletAddress: (address: string) => void;
  setFortuneResult: (result: FortuneResult | null) => void;
  setGeneratedWallet: (wallet: GeneratedWallet | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setIsGenerating: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFortuneStore = create<FortuneState>((set) => ({
  walletAddress: '',
  fortuneResult: null,
  generatedWallet: null,
  isAnalyzing: false,
  isGenerating: false,
  error: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setFortuneResult: (result) => set({ fortuneResult: result }),
  setGeneratedWallet: (wallet) => set({ generatedWallet: wallet }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      walletAddress: '',
      fortuneResult: null,
      generatedWallet: null,
      isAnalyzing: false,
      isGenerating: false,
      error: null,
    }),
}));
