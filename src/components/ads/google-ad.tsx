"use client"

import { useEffect } from "react"

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
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("Error loading Google Ad:", error)
    }
  }, [])

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}