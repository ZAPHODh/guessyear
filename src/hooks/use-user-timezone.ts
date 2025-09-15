"use client"

import { useState, useEffect } from "react"

export function useUserTimezone() {
  const [timezone, setTimezone] = useState<string | null>(null)

  useEffect(() => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setTimezone(userTimezone)
    } catch (error) {
      console.warn("Could not detect user timezone:", error)
      setTimezone(null)
    }
  }, [])

  return timezone
}