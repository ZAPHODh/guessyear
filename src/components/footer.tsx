'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import Icons from "@/components/shared/icons"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"
import { CookieSettingsDialog } from "@/components/cookie-consent"

export default function FooterSection() {
    const pathname = usePathname()
    const scopedT = useScopedI18n("footer")
    const locale = useCurrentLocale()

    if (pathname.includes('/admin')) {
        return null
    }

    const footerLinks = [
        { name: scopedT("howToPlay"), href: "/how-to-play" },
        { name: scopedT("leaderboard"), href: "/leaderboard" },
        { name: scopedT("dailyChallenge"), href: "/daily" },
        { name: scopedT("lobby"), href: "/lobby" },
        { name: scopedT("help"), href: "/help" },
        { name: scopedT("contact"), href: "/contact" },
        { name: scopedT("privacy"), href: "/privacy" },
        { name: scopedT("terms"), href: "/terms" },
    ]

    return (
        <footer className="py-12">
            <div className="mx-auto max-w-4xl px-6">
                <div className="flex flex-col items-center space-y-6">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="text-lg font-semibold hover:text-primary transition-colors">
                        {siteConfig(locale).name}
                    </Link>

                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        {footerLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X/Twitter"
                            className="text-muted-foreground hover:text-foreground transition-colors">
                            <Icons.twitter className="h-5 w-5" />
                        </Link>
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-muted-foreground hover:text-foreground transition-colors">
                            <Icons.gitHub className="h-5 w-5" />
                        </Link>
                        <CookieSettingsDialog>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground p-1">
                                {scopedT("cookieSettings")}
                            </Button>
                        </CookieSettingsDialog>
                    </div>

                    <span className="text-muted-foreground text-xs">
                        © {new Date().getFullYear()} {siteConfig(locale).name}
                    </span>
                </div>
            </div>
        </footer>
    )
}
