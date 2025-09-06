import { type User } from "@prisma/client";
import { z } from "zod";

export type CurrentUser = {
    id: string;
    name: string;
    email: string;
    picture: string;
};

export interface payload {
    name: string;
    email: string;
    picture?: string;
}

export const settingsSchema = z.object({
    picture: z.string().url(),
    name: z
        .string({
            error: "Please type your name.",
        })
        .min(3, {
            message: "Name must be at least 3 characters.",
        })
        .max(50, {
            message: "Name must be at most 50 characters.",
        }),
    email: z.string().email(),
    shortBio: z.string().optional(),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: number;
        isPro: boolean;
    };

export interface SendWelcomeEmailProps {
    toMail: string;
    userName: string;
}

export interface SendOTPProps extends SendWelcomeEmailProps {
    code: string;
}

export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentDate: string;
  version: number;
}

export const defaultPreferences: CookiePreferences = {
  essential: true,
  performance: false,
  functional: false,
  marketing: false,
};

export const COOKIE_CONSENT_NAME = "cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_DURATION_MONTHS = 12;

export interface GoogleAnalyticsConfig {
  measurementId: string;
}

export interface GoogleAdsConfig {
  conversionId: string;
}