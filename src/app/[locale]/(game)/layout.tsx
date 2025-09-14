import Link from "next/link"
import ModeToggle from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { getCurrentLocale } from "@/locales/server"
import { GameSettingsDropdown } from "@/components/shared/game-settings-dropdown"

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getCurrentLocale()
  const config = siteConfig(locale)

  return (
    <div className="min-h-screen">
      <nav className="backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 flex justify-start">
              <GameSettingsDropdown />

            </div>

            <div className="flex-1 flex justify-center">
              <Link href={`/${locale}`} className="font-bold text-xl">
                {config.name}
              </Link>
            </div>

            <div className="flex-1 flex justify-end">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}