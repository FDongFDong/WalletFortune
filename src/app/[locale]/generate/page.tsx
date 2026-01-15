'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import WalletGenerator from '@/components/WalletGenerator';

export default function GeneratePage() {
  const t = useTranslations('generate');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <Wallet className="w-16 h-16 text-purple-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">{t('title')}</h1>
        <p className="text-gray-400">{t('description')}</p>
      </motion.div>

      <WalletGenerator />
    </div>
  );
}
