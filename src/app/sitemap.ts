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
          fr: `${siteUrl}/fr`,
          es: `${siteUrl}/es`,
          de: `${siteUrl}/de`,
          it: `${siteUrl}/it`,
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
          fr: `${siteUrl}/fr/login`,
          es: `${siteUrl}/es/login`,
          de: `${siteUrl}/de/login`,
          it: `${siteUrl}/it/login`,
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
          fr: `${siteUrl}/fr/daily`,
          es: `${siteUrl}/es/daily`,
          de: `${siteUrl}/de/daily`,
          it: `${siteUrl}/it/daily`,
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
          fr: `${siteUrl}/fr/daily/how-to-play`,
          es: `${siteUrl}/es/daily/how-to-play`,
          de: `${siteUrl}/de/daily/how-to-play`,
          it: `${siteUrl}/it/daily/how-to-play`,
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
          fr: `${siteUrl}/fr/privacy`,
          es: `${siteUrl}/es/privacy`,
          de: `${siteUrl}/de/privacy`,
          it: `${siteUrl}/it/privacy`,
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
          fr: `${siteUrl}/fr/terms`,
          es: `${siteUrl}/es/terms`,
          de: `${siteUrl}/de/terms`,
          it: `${siteUrl}/it/terms`,
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
          fr: `${siteUrl}/fr/contact`,
          es: `${siteUrl}/es/contact`,
          de: `${siteUrl}/de/contact`,
          it: `${siteUrl}/it/contact`,
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
          fr: `${siteUrl}/fr/help`,
          es: `${siteUrl}/es/help`,
          de: `${siteUrl}/de/help`,
          it: `${siteUrl}/it/help`,
        },
      },
    },
  ];
}