'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Wallet, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowLang(false);
    };
    if (showLang) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLang]);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setShowLang(false);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-[var(--secondary)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2" onClick={closeMobileMenu}>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            <span className="text-lg sm:text-xl font-bold gradient-text">{t('title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-6">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('analyze')}</span>
            </Link>
            <Link
              href={`/${locale}/generate`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>{t('generate')}</span>
            </Link>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLang(!showLang);
                }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find((l) => l.code === locale)?.label}</span>
              </button>

              {showLang && (
                <div className="absolute right-0 top-full mt-2 bg-[var(--secondary)] border border-purple-500/20 rounded-lg overflow-hidden shadow-xl min-w-[120px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className={`block w-full px-4 py-2.5 text-left hover:bg-purple-500/20 transition-colors ${
                        locale === lang.code ? 'text-purple-400 bg-purple-500/10' : 'text-gray-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="sm:hidden pt-4 pb-2 border-t border-purple-500/20 mt-3 space-y-1">
            <Link
              href={`/${locale}`}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-2 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('analyze')}</span>
            </Link>
            <Link
              href={`/${locale}/generate`}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-2 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <Wallet className="w-5 h-5" />
              <span>{t('generate')}</span>
            </Link>
            <div className="border-t border-purple-500/10 pt-2 mt-2">
              <p className="px-2 py-1 text-xs text-gray-500 uppercase tracking-wider">Language</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`px-3 py-2 text-left rounded-lg transition-colors ${
                      locale === lang.code
                        ? 'text-purple-400 bg-purple-500/20'
                        : 'text-gray-300 hover:bg-purple-500/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
