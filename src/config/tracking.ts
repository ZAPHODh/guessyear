import { GoogleAnalyticsConfig, GoogleAdsConfig } from "@/types";

export const googleAnalyticsConfig: GoogleAnalyticsConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

export const googleAdsConfig: GoogleAdsConfig = {
  conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-XXXXXXXXX",
};

export const isTrackingEnabled = process.env.NODE_ENV === "production" && 
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && 
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;