import { useScopedI18n } from "@/locales/client"

export function useLocales() {
  const scopedT = useScopedI18n("shared")
  return [
    {
      name: scopedT("locales.english"),
      value: "en" as const,
    },
    {
      name: scopedT("locales.portuguese"),
      value: "pt" as const,
    },
    {
      name: scopedT("locales.spanish"),
      value: "es" as const,
    },
    {
      name: scopedT("locales.french"),
      value: "fr" as const,
    },
    {
      name: scopedT("locales.german"),
      value: "de" as const,
    },
    {
      name: scopedT("locales.italian"),
      value: "it" as const,
    },
  ]
}