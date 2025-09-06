'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icons from "@/components/shared/icons";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { CookieSettingsDialog } from "@/components/cookie-consent";

export default function Footer() {
  const pathname = usePathname();
  const scopedT = useScopedI18n("footer");
  const locale = useCurrentLocale()
  
  if (pathname.includes('/daily')) {
    return null;
  }
  const footerLinks = {
    game: [
      { name: scopedT("howToPlay"), href: "/how-to-play" },
      { name: scopedT("leaderboard"), href: "/leaderboard" },
      { name: scopedT("dailyChallenge"), href: "/daily" },
      { name: scopedT("categories"), href: "/categories" },
    ],
    community: [
      { name: scopedT("lobby"), href: "/lobby" },
      { name: scopedT("tournaments"), href: "/tournaments" },
      { name: scopedT("achievements"), href: "/achievements" },
    ],
    support: [
      { name: scopedT("help"), href: "/help" },
      { name: scopedT("contact"), href: "/contact" },
      { name: scopedT("privacy"), href: "/privacy" },
      { name: scopedT("terms"), href: "/terms" },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Icons.logo className="h-8 w-8" />
              <span className="font-bold text-xl">{siteConfig(locale).name}</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              {scopedT("gameDescription")}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {scopedT("guessTheImage")}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {scopedT("compete")}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {scopedT("global")}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/play">
                  {scopedT("playNow")}
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              {scopedT("gameMenu")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.game.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              {scopedT("community")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              {scopedT("support")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <CookieSettingsDialog>
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
                  {scopedT("cookieSettings")}
                </Button>
              </CookieSettingsDialog>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {siteConfig(locale).name}. {scopedT("allRightsReserved")}.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="https://twitter.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://github.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.gitHub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {scopedT("madeWith")} 🧠 & ❤️
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}