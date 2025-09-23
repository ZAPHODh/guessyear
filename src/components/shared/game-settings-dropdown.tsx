"use client"

import { useState, useEffect } from "react"
import { Settings, Clock, Languages, CheckIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChangeLocale, useCurrentLocale, useScopedI18n } from "@/locales/client"
import { useLocales } from "@/hooks/use-locales"
import Link from "next/link"

export function GameSettingsDropdown() {
  const scopedT = useScopedI18n("shared")
  const changeLocale = useChangeLocale({ preserveSearchParams: true })
  const currentLocale = useCurrentLocale()
  const locales = useLocales()
  const [timeUntilNextImage, setTimeUntilNextImage] = useState<string>("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilNextImage(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{scopedT("settings")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/lobby">
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Multiplayer</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="mr-2 h-4 w-4" />
            <span>{scopedT("changeLocale")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {locales.map((locale) => (
              <DropdownMenuItem
                key={locale.value}
                onClick={() => changeLocale(locale.value as typeof currentLocale)}
                disabled={locale.value === currentLocale}
              >
                <span>{locale.name}</span>
                {locale.value === currentLocale ? (
                  <DropdownMenuShortcut>
                    <CheckIcon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          {scopedT("nextImage")}
        </DropdownMenuLabel>
        <div className="px-2 py-1 text-center">
          <div className="text-lg font-mono font-bold">{timeUntilNextImage}</div>
          <div className="text-xs text-muted-foreground">{scopedT("timeRemaining")}</div>
        </div>




      </DropdownMenuContent>
    </DropdownMenu>
  )
}