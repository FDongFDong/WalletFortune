import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://walletfortune.com';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8B5CF6',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'WalletFortune - Crypto Fortune by Wallet Address',
    template: '%s | WalletFortune',
  },
  description:
    'Discover your crypto fortune through your wallet address using Eastern philosophy (Five Elements, Yin-Yang). Get personalized coin recommendations based on your wallet analysis.',
  keywords: [
    'crypto fortune',
    'wallet fortune',
    'crypto saju',
    'blockchain fortune',
    'ethereum wallet',
    'wallet analysis',
    'crypto recommendation',
    'five elements',
    'yin yang',
    'wallet personality',
    '암호화폐 운세',
    '지갑 사주',
    '코인 추천',
  ],
  authors: [{ name: 'WalletFortune Team' }],
  creator: 'WalletFortune',
  publisher: 'WalletFortune',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US', 'ja_JP', 'zh_CN'],
    url: SITE_URL,
    siteName: 'WalletFortune',
    title: 'WalletFortune - Crypto Fortune by Wallet Address',
    description:
      'Discover your crypto fortune using Eastern philosophy. Analyze your wallet and get personalized recommendations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WalletFortune - Crypto Fortune Teller',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WalletFortune - Crypto Fortune by Wallet Address',
    description: 'Discover your crypto fortune using Eastern philosophy',
    images: ['/og-image.png'],
    creator: '@walletfortune',
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': `${SITE_URL}/ko`,
      'en-US': `${SITE_URL}/en`,
      'ja-JP': `${SITE_URL}/ja`,
      'zh-CN': `${SITE_URL}/zh`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <JsonLd />
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-[var(--background)]">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
