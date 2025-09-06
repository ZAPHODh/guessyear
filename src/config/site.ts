export const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

export const siteConfig = (locale: string = "en") => ({
    name: "GuessYear",
    url: siteUrl + "/" + locale,
    ogImage: `${siteUrl}/${locale}/opengraph-image`,
    description: "Challenge your visual skills! Guess images from around the world and compete globally.",
    links: {
        twitter: "https://twitter.com/guessitgame",
        github: "https://github.com/guessitgame",
        facebook: "https://www.facebook.com/guessitgame",
        instagram: "https://www.instagram.com/guessitgame",
        linkedin: "https://www.linkedin.com/company/guessitgame",
    },
    tel: "+1-555-GUESS-IT",
    email: "support@guessit.game",
    address: "123 Game Street, Digital City, Worldwide",
});

export type SiteConfig = typeof siteConfig;