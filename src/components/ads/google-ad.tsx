"use client"

import { useEffect, useRef } from "react"

interface GoogleAdProps {
  adSlot: string
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical"
  fullWidthResponsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function GoogleAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = ""
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdLoaded = useRef(false)

  useEffect(() => {
    const loadAd = () => {
      try {
        if (typeof window !== "undefined" &&
          window.adsbygoogle &&
          adRef.current &&
          !isAdLoaded.current) {

          const hasDataAdStatus = adRef.current.getAttribute('data-ad-status')
          if (hasDataAdStatus) {
            return
          }

          (window.adsbygoogle = window.adsbygoogle || []).push({})
          isAdLoaded.current = true
        }
      } catch (error) {
        console.error("Error loading Google Ad:", error)
      }
    }

    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`google-ad-container min-h-[250px] min-w-[300px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minWidth: "300px",
          minHeight: "150px"
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}