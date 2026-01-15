/**
 * JSON-LD Structured Data Component
 * 검색 엔진 리치 스니펫을 위한 구조화된 데이터
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://walletfortune.com';

interface JsonLdProps {
  /** 페이지 타입 */
  type?: 'website' | 'webApplication';
}

export default function JsonLd({ type = 'webApplication' }: JsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'webApplication' ? 'WebApplication' : 'WebSite',
    name: 'WalletFortune',
    url: SITE_URL,
    description:
      'Discover your crypto fortune through your wallet address using Eastern philosophy (Five Elements, Yin-Yang).',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'WalletFortune Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WalletFortune',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    inLanguage: ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?address={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
