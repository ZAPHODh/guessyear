"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useScopedI18n } from "@/locales/client"
import type { LocalizedTips, SupportedLocale } from "@/types/tip"

const getLanguages = (t: any) => [
  { code: 'en' as SupportedLocale, name: t('languages.english'), flag: '🇺🇸' },
  { code: 'pt' as SupportedLocale, name: t('languages.portuguese'), flag: '🇧🇷' },
]

interface MultiLanguageTextareaProps {
  value: LocalizedTips
  onChange: (value: LocalizedTips) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MultiLanguageTextarea({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = ""
}: MultiLanguageTextareaProps) {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLocale>('en')
  const t = useScopedI18n('admin.multiLanguage')
  const LANGUAGES = getLanguages(t)

  const handleLanguageChange = (lang: SupportedLocale, text: string) => {
    onChange({
      ...value,
      [lang]: text
    })
  }

  const getFilledLanguageCount = () => {
    return Object.values(value).filter(tip => tip && tip.trim()).length
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => {
          const isActive = activeLanguage === lang.code
          const hasContent = value[lang.code] && value[lang.code]!.trim()
          
          return (
            <Button
              key={lang.code}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveLanguage(lang.code)}
              disabled={disabled}
              className="relative"
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.name}
              {hasContent && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  ✓
                </Badge>
              )}
            </Button>
          )
        })}
      </div>
      
      <div className="relative">
        <Textarea
          value={value[activeLanguage] || ''}
          onChange={(e) => handleLanguageChange(activeLanguage, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="resize-none min-h-[100px]"
        />
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">
          {getFilledLanguageCount()}/{LANGUAGES.length} {t('languagesCount')}
        </div>
      </div>
    </div>
  )
}