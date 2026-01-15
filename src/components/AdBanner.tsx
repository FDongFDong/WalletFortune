'use client';

import { useEffect, useRef } from 'react';

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface AdBannerProps {
  /** AdSense 광고 슬롯 ID */
  slot: string;
  /** 광고 포맷 */
  format?: AdFormat;
  /** 반응형 여부 */
  responsive?: boolean;
  /** 추가 클래스 */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Google AdSense 광고 배너 컴포넌트
 * 환경변수에 NEXT_PUBLIC_ADSENSE_CLIENT_ID가 설정된 경우에만 광고 표시
 */
export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || isInitialized.current) return;

    try {
      if (adRef.current && adRef.current.offsetWidth > 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isInitialized.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [clientId]);

  // AdSense 클라이언트 ID가 없으면 렌더링하지 않음
  if (!clientId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
