'use client';

import { googleAnalyticsConfig, googleAdsConfig, isTrackingEnabled } from "@/config/tracking";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initializeGoogleAnalytics = () => {
  if (!isTrackingEnabled || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', googleAnalyticsConfig.measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  });

  window.gtag('config', googleAdsConfig.conversionId);
};

export const trackPageView = (url: string, title?: string) => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', googleAnalyticsConfig.measurementId, {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.origin + url,
  });
};

export const trackEvent = (eventName: string, parameters?: any) => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    custom_parameter: true,
    ...parameters,
  });
};

export const trackConversion = (conversionLabel: string, value?: number) => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${googleAdsConfig.conversionId}/${conversionLabel}`,
    value: value || 0,
    currency: 'USD',
  });
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items,
  });
};

export const trackSignUp = (method: string = 'email') => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: method,
  });
};

export const trackLogin = (method: string = 'email') => {
  if (!isTrackingEnabled || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'login', {
    method: method,
  });
};

export const trackGameStart = (gameType: string) => {
  trackEvent('game_start', {
    game_type: gameType,
    engagement_time_msec: 1,
  });
};

export const trackGameComplete = (gameType: string, score: number, success: boolean) => {
  trackEvent('game_complete', {
    game_type: gameType,
    score: score,
    success: success,
  });
};

export const trackDailyChallenge = (attempts: number, success: boolean) => {
  trackEvent('daily_challenge', {
    attempts: attempts,
    success: success,
  });
};

export const disableGoogleTracking = () => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  const gaCookies = ['_ga', '_gat', '_gid', '_gtag_GA', '_ga_' + googleAnalyticsConfig.measurementId.replace('G-', '')];
  gaCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')};`;
  });
};

export const enableGoogleTracking = () => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  }
};