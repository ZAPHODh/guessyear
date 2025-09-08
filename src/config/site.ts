export const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

export const siteConfig = (locale: string = "en") => ({
    name: "Loqano",
    url: siteUrl + "/" + locale,
    ogImage: `${siteUrl}/${locale}/opengraph-image`,
    description: "Challenge your visual skills! Guess images from around the world and compete globally.",
    links: {
        twitter: "https://twitter.com/loqano",
        github: "https://github.com/loqano",
        facebook: "https://www.facebook.com/loqano",
        instagram: "https://www.instagram.com/loqano",
        linkedin: "https://www.linkedin.com/company/loqano",
    },
    tel: "+1-555-LOQANO",
    email: "support@loqano.com",
    address: "123 Game Street, Digital City, Worldwide",
});

export type SiteConfig = typeof siteConfig;