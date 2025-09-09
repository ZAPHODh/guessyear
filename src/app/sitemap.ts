import { type MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          pt: `${siteUrl}/pt`,
        },
      },
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${siteUrl}/en/login`,
          pt: `${siteUrl}/pt/login`,
        },
      },
    },
    {
      url: `${siteUrl}/daily`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en/daily`,
          pt: `${siteUrl}/pt/daily`,
        },
      },
    },
    {
      url: `${siteUrl}/daily/how-to-play`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${siteUrl}/en/daily/how-to-play`,
          pt: `${siteUrl}/pt/daily/how-to-play`,
        },
      },
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${siteUrl}/en/privacy`,
          pt: `${siteUrl}/pt/privacy`,
        },
      },
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${siteUrl}/en/terms`,
          pt: `${siteUrl}/pt/terms`,
        },
      },
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: {
        languages: {
          en: `${siteUrl}/en/contact`,
          pt: `${siteUrl}/pt/contact`,
        },
      },
    },
    {
      url: `${siteUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: {
        languages: {
          en: `${siteUrl}/en/help`,
          pt: `${siteUrl}/pt/help`,
        },
      },
    },
  ];
}