'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  User,
  Leaf,
  Flame,
  Mountain,
  Coins,
  Droplets,
  Sun,
  Moon,
  Scale,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { FortuneResult as FortuneResultType, Element } from '@/lib/fortune/types';

interface FortuneResultProps {
  result: FortuneResultType;
  onReset: () => void;
}

const elementIcons: Record<Element, React.ReactNode> = {
  water: <Droplets className="w-6 h-6" />,
  wood: <Leaf className="w-6 h-6" />,
  fire: <Flame className="w-6 h-6" />,
  earth: <Mountain className="w-6 h-6" />,
  metal: <Coins className="w-6 h-6" />,
};

const elementColors: Record<Element, string> = {
  water: 'element-water',
  wood: 'element-wood',
  fire: 'element-fire',
  earth: 'element-earth',
  metal: 'element-metal',
};

export default function FortuneResult({ result, onReset }: FortuneResultProps) {
  const t = useTranslations();
  const tResult = useTranslations('result');
  const tPersonality = useTranslations('personality');
  const tElements = useTranslations('elements');
  const tYinyang = useTranslations('yinyang');
  const tPatterns = useTranslations('patterns');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <p className="text-gray-400 font-mono text-sm break-all">{result.checksumAddress}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">{tResult('personality')}</h3>
          </div>
          <p className="text-xl font-bold text-purple-300">
            {tPersonality(result.personality)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {tPersonality(`${result.personality}Desc`)}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">{tResult('luckyIndex')}</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold gradient-text">{result.luckyIndex}</span>
            <span className="text-gray-400 text-xl mb-1">/ 100</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${result.luckyIndex}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            {elementIcons[result.elements.mainElement]}
            <h3 className="text-lg font-semibold">{tResult('element')}</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">{tResult('mainElement')}</p>
              <p className={`text-xl font-bold ${elementColors[result.elements.mainElement]}`}>
                {tElements(result.elements.mainElement)}
              </p>
              <p className="text-gray-400 text-sm">
                {tElements(`${result.elements.mainElement}Desc`)}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-sm text-gray-400">{tResult('weakElement')}</p>
              <p className={`font-semibold ${elementColors[result.elements.weakElement]}`}>
                {tElements(result.elements.weakElement)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            {result.yinyang.type === 'yang' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : result.yinyang.type === 'yin' ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Scale className="w-5 h-5 text-green-400" />
            )}
            <h3 className="text-lg font-semibold">{tResult('yinyang')}</h3>
          </div>
          <p className="text-xl font-bold">{tYinyang(result.yinyang.type)}</p>
          <p className="text-gray-400 text-sm mt-2">
            {tYinyang(`${result.yinyang.type}Desc`)}
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-yellow-400">Yang: {result.yinyang.yangCount}</span>
            <span className="text-blue-400">Yin: {result.yinyang.yinCount}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold">{tResult('patterns')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.patterns.patterns.map((pattern) => (
              <span
                key={pattern}
                className={`px-3 py-1 rounded-full text-sm ${
                  pattern === 'none'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {tPatterns(pattern)}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h4 className="font-semibold">{tResult('recommendedCoins')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.recommendedCoins.map((coin) => (
                  <span
                    key={coin}
                    className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                  >
                    {coin}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h4 className="font-semibold">{tResult('cautionCoins')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.cautionCoins.map((coin) => (
                  <span
                    key={coin}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm"
                  >
                    {coin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('common.reset')}
        </button>
      </motion.div>
    </motion.div>
  );
}
