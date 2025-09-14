'use server';

import { type Metadata } from "next"
import { getScopedI18n } from "@/locales/server"
import { siteUrl } from "@/config/site"
import { DailyGame } from "@/components/layout/daily-game"
import { getTodayImage } from "./actions"
import type { SupportedLocale } from "@/types/tip"

export async function generateMetadata(): Promise<Metadata> {
  const scopedT = await getScopedI18n("metadata");
  const generalKeywords = Array.from({ length: 11 }, (_, i) => scopedT(`keywords.${i}` as any));
  const dailyKeywords = [
    "Daily Challenge",
    "Today's Photo",
    "Daily Photo Game",
    "Photo of the Day",
    "Daily Quiz",
    "Photo Challenge Today"
  ];

  return {
    title: scopedT("daily.title"),
    description: scopedT("daily.description"),
    keywords: [...generalKeywords, ...dailyKeywords],
    openGraph: {
      title: scopedT("daily.title"),
      description: scopedT("daily.description"),
      type: "website",
      url: `${siteUrl}/daily`,
      images: [
        {
          url: `${siteUrl}/api/og?page=daily`,
          width: 1200,
          height: 630,
          alt: scopedT("daily.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: scopedT("daily.title"),
      description: scopedT("daily.description"),
      images: [`${siteUrl}/api/og?page=daily`],
    },
  };
}

interface DailyPageProps {
  params: Promise<{ locale: string }>
}

export default async function DailyPage({ params }: DailyPageProps) {
  const { locale } = await params
  const initialGameState = await getTodayImage(locale as SupportedLocale)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <DailyGame initialGameState={initialGameState} />
      </div>
    </div>
  )
}