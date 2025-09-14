import Link from "next/link"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { getCurrentLocale } from "@/locales/server"

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
              <ModeToggle />
            </div>

            <div className="flex-1 flex justify-center">
              <Link href={`/${locale}`} className="font-bold text-xl">
                {config.name}
              </Link>
            </div>

            <div className="flex-1 flex justify-end">
              <Button variant="outline" size="icon" >
                <Settings className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Settings</span>
              </Button>
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