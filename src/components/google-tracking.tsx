'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { googleAnalyticsConfig, googleAdsConfig, isTrackingEnabled } from '@/config/tracking';
import { initializeGoogleAnalytics, enableGoogleTracking, disableGoogleTracking } from '@/lib/google-tracking';
import { type CookiePreferences } from '@/types';

interface GoogleTrackingProps {
  cookiePreferences?: CookiePreferences;
}

export function GoogleTracking({ cookiePreferences }: GoogleTrackingProps) {
  useEffect(() => {
    if (!isTrackingEnabled || !cookiePreferences) return;

      if (cookiePreferences.performance || cookiePreferences.marketing) {
      enableGoogleTracking();
    } else {
      disableGoogleTracking();
    }
  }, [cookiePreferences]);

  if (!isTrackingEnabled || !cookiePreferences?.performance) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsConfig.measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          initializeGoogleAnalytics();
        }}
      />
      
      <Script
        id="google-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': '${cookiePreferences?.marketing ? 'granted' : 'denied'}',
              'ad_user_data': '${cookiePreferences?.marketing ? 'granted' : 'denied'}',
              'ad_personalization': '${cookiePreferences?.marketing ? 'granted' : 'denied'}',
            });
            
            gtag('config', '${googleAnalyticsConfig.measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
            
            gtag('config', '${googleAdsConfig.conversionId}');
          `,
        }}
      />
    </>
  );
}

export function useGoogleTracking() {
  const trackPageView = (url: string, title?: string) => {
    import('@/lib/google-tracking').then(({ trackPageView }) => {
      trackPageView(url, title);
    });
  };

  const trackEvent = (eventName: string, parameters?: any) => {
    import('@/lib/google-tracking').then(({ trackEvent }) => {
      trackEvent(eventName, parameters);
    });
  };

  const trackConversion = (conversionLabel: string, value?: number) => {
    import('@/lib/google-tracking').then(({ trackConversion }) => {
      trackConversion(conversionLabel, value);
    });
  };

  const trackGameStart = (gameType: string) => {
    import('@/lib/google-tracking').then(({ trackGameStart }) => {
      trackGameStart(gameType);
    });
  };

  const trackGameComplete = (gameType: string, score: number, success: boolean) => {
    import('@/lib/google-tracking').then(({ trackGameComplete }) => {
      trackGameComplete(gameType, score, success);
    });
  };

  const trackDailyChallenge = (attempts: number, success: boolean) => {
    import('@/lib/google-tracking').then(({ trackDailyChallenge }) => {
      trackDailyChallenge(attempts, success);
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackGameStart,
    trackGameComplete,
    trackDailyChallenge,
  };
}