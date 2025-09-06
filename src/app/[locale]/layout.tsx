import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { siteConfig, siteUrl } from "@/config/site";
import { I18nProviderClient } from "@/locales/client";

import "../globals.css";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const locale = p.locale;
  const site = siteConfig(locale);

  const siteOgImage = `${siteUrl}/api/og?locale=${locale}`;

  return {
    title: {
      default: site.name,
      template: `%s - ${site.name}`,
    },
    description: site.description,
    keywords: [
      "Freelancer",
      "Projects",
      "Freelance",
      "FreelanceHub",
      "Freelance Projects",
      "Freelance Jobs",
      "Freelance Work",
      "Freelance Platform",
      "Freelance Marketplace",
      "Freelance Community",
      "Freelance Opportunities",
    ],
    authors: [
      {
        name: "ZAPHODh",
        url: "",
      },
    ],
    creator: "Luis Paulo",
    openGraph: {
      type: "website",
      locale: locale,
      url: site.url,
      title: site.name,
      description: site.description,
      siteName: site.name,
      images: [
        {
          url: siteOgImage,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: [siteOgImage],
      creator: "@ZaphodL",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteUrl}/manifest.json`,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        pt: "/pt",
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.name,
    },
  };
}

export const viewport = {
  width: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default async function RootLayout({
  children,
  loginDialog,
  params,
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProviderClient locale={locale}>
            <Header />
            <main>
              {children}
              {loginDialog}
            </main>
            <Footer />
          </I18nProviderClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}