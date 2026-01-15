'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice6, Loader2, Copy, Check, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { generateWallet, downloadWalletJson, GeneratedWallet } from '@/lib/wallet/generator';
import { analyzeWallet } from '@/lib/fortune/analyzer';
import { FortuneResult } from '@/lib/fortune/types';

export default function WalletGenerator() {
  const t = useTranslations('generate');
  const tCommon = useTranslations('common');
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<'address' | 'privateKey' | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWallet(null);
    setFortune(null);
    setShowPrivateKey(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newWallet = generateWallet();
    const fortuneResult = analyzeWallet(newWallet.address);

    setWallet(newWallet);
    setFortune(fortuneResult);
    setIsGenerating(false);
  };

  const handleCopy = async (type: 'address' | 'privateKey') => {
    if (!wallet) return;
    const text = type === 'address' ? wallet.address : wallet.privateKey;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    if (wallet) {
      downloadWalletJson(wallet, fortune);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.5, repeat: Infinity },
              }}
            >
              <Dice6 className="w-24 h-24 text-purple-500" />
            </motion.div>
            <p className="mt-6 text-gray-400 text-lg">{t('generating')}</p>
          </motion.div>
        ) : wallet && fortune ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">{t('result')}</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">{t('address')}</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-black/30 rounded-lg font-mono text-sm break-all text-green-400">
                      {wallet.address}
                    </code>
                    <button
                      onClick={() => handleCopy('address')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied === 'address' ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">{t('privateKey')}</label>
                  <div className="flex items-center gap-2">
                    <code
                      className={`flex-1 px-4 py-3 bg-black/30 rounded-lg font-mono text-sm break-all ${
                        showPrivateKey ? 'text-red-400' : 'text-gray-600'
                      }`}
                      onClick={() => setShowPrivateKey(true)}
                    >
                      {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => handleCopy('privateKey')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied === 'privateKey' ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {!showPrivateKey && (
                    <p className="text-xs text-gray-500 mt-1">Click to reveal</p>
                  )}
                </div>

                <div className="flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-200">{t('warning')}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Lucky Index</p>
                  <p className="text-2xl font-bold gradient-text">{fortune.luckyIndex}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Element</p>
                  <p className="text-xl font-bold capitalize">{fortune.elements.mainElement}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Yin-Yang</p>
                  <p className="text-xl font-bold capitalize">{fortune.yinyang.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Personality</p>
                  <p className="text-xl font-bold capitalize">{fortune.personality}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                {t('downloadJson')}
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                {t('newWallet')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="inline-block mb-8"
            >
              <Dice6 className="w-24 h-24 text-purple-500" />
            </motion.div>

            <button onClick={handleGenerate} className="btn-primary text-lg px-8 py-4">
              {t('button')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
