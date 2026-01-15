'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2 } from 'lucide-react';
import { isAddress } from 'viem';

interface WalletInputProps {
  onAnalyze: (address: string) => void;
  isLoading: boolean;
}

export default function WalletInput({ onAnalyze, isLoading }: WalletInputProps) {
  const t = useTranslations('analyze');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAddress(address)) {
      setError(t('invalidAddress'));
      return;
    }

    onAnalyze(address);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full px-6 py-4 pr-14 bg-[var(--secondary)] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !address}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-red-400 text-sm text-center">{error}</p>}
      <p className="mt-2 text-gray-500 text-xs text-center">{t('supportedChains')}</p>
    </form>
  );
}
