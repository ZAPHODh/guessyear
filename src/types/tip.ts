export type SupportedLocale = 'en' | 'pt' | 'fr' | 'es' | 'de' | 'it'

export type LocalizedTips = {
  [K in SupportedLocale]?: string
}

export function getLocalizedTip(tips: LocalizedTips | null, locale: SupportedLocale): string | undefined {
  if (!tips) return undefined
  
  // Try to get the tip in the requested locale
  const tip = tips[locale]
  if (tip && tip.trim()) return tip
  
  // Fallback to English if available
  const englishTip = tips['en']
  if (englishTip && englishTip.trim()) return englishTip
  
  // Fallback to any available language
  for (const lang of (['en', 'pt', 'fr', 'es', 'de', 'it'] as SupportedLocale[])) {
    const fallbackTip = tips[lang]
    if (fallbackTip && fallbackTip.trim()) return fallbackTip
  }
  
  return undefined
}

export function createEmptyLocalizedTips(): LocalizedTips {
  return {
    en: '',
    pt: '',
    fr: '',
    es: '',
    de: '',
    it: ''
  }
}