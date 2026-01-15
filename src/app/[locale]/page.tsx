'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import WalletInput from '@/components/WalletInput';
import FortuneResult from '@/components/FortuneResult';
import { analyzeWallet } from '@/lib/fortune/analyzer';
import { FortuneResult as FortuneResultType } from '@/lib/fortune/types';

export default function HomePage() {
  const t = useTranslations('common');
  const tAnalyze = useTranslations('analyze');
  const [result, setResult] = useState<FortuneResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (address: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fortuneResult = analyzeWallet(address);
    setResult(fortuneResult);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] sm:min-h-[80vh] flex flex-col items-center justify-center py-6 sm:py-8">
      {!result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 sm:space-y-8 px-4 sm:px-0 w-full"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500" />
            </motion.div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg px-4 sm:px-0">{t('subtitle')}</p>
          </div>

          <div className="pt-2 sm:pt-4 w-full">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">{tAnalyze('title')}</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 px-4 sm:px-0">
              {tAnalyze('description')}
            </p>
            <WalletInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </motion.div>
      ) : (
        <FortuneResult result={result} onReset={handleReset} />
      )}
    </div>
  );
}
