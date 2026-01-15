/**
 * Sitemap Generator
 * SEO를 위한 동적 사이트맵 생성
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://walletfortune.com';
const LOCALES = ['ko', 'en', 'ja', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // 각 로케일별 메인 페이지
  LOCALES.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  });

  // 루트 페이지
  routes.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return routes;
}
