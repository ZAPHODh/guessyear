"use client"

import { Languages, CheckIcon } from "lucide-react"
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { useChangeLocale, useCurrentLocale, useScopedI18n } from "@/locales/client"
import { useLocales } from "@/hooks/use-locales"

export default function LocaleSelector({ currentLocale }: { currentLocale: string }) {
  const scopedT = useScopedI18n("shared")
  const changeLocale = useChangeLocale({ preserveSearchParams: true })
  const activeLocale = useCurrentLocale()
  const locales = useLocales()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages className="mr-2 h-4 w-4" />
        <span>{scopedT("changeLocale")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => changeLocale(locale.value as typeof activeLocale)}
            disabled={locale.value === activeLocale}
          >
            <span>{locale.name}</span>
            {locale.value === activeLocale ? (
              <DropdownMenuShortcut>
                <CheckIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}