'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Wallet, Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [showLang, setShowLang] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setShowLang(false);
  };

  return (
    <header className="border-b border-purple-500/20 bg-[var(--secondary)]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold gradient-text">{t('title')}</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{t('analyze')}</span>
            </Link>
            <Link
              href={`/${locale}/generate`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">{t('generate')}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {languages.find((l) => l.code === locale)?.label}
                </span>
              </button>

              {showLang && (
                <div className="absolute right-0 top-full mt-2 bg-[var(--secondary)] border border-purple-500/20 rounded-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className={`block w-full px-4 py-2 text-left hover:bg-purple-500/20 transition-colors ${
                        locale === lang.code ? 'text-purple-400' : 'text-gray-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
