"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface DailyImage {
  id: string
  cloudinaryUrl: string
  year: number
  description: string | null
  date: Date
  _count: {
    gameProgress: number
  }
}

interface ImagesContextType {
  images: DailyImage[]
  setImages: (images: DailyImage[]) => void
  refreshImages: () => Promise<void>
  todayImage: DailyImage | undefined
  scheduledImages: DailyImage[]
  unscheduledImages: DailyImage[]
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined)

interface ImagesProviderProps {
  children: ReactNode
  initialImages: DailyImage[]
  refreshImages: () => Promise<DailyImage[]>
}

export function ImagesProvider({ children, initialImages, refreshImages: fetchImages }: ImagesProviderProps) {
  const [images, setImages] = useState<DailyImage[]>(initialImages)

  const refreshImages = async () => {
    try {
      const newImages = await fetchImages()
      setImages(newImages)
    } catch (error) {
      console.error('Failed to refresh images:', error)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayImage = images.find(img => {
    const imgDate = new Date(img.date)
    imgDate.setHours(0, 0, 0, 0)
    return imgDate.getTime() === today.getTime()
  })

  const scheduledImages = images.filter(img => {
    const imgDate = new Date(img.date)
    return imgDate < new Date('2099-01-01')
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const unscheduledImages = images.filter(img => {
    const imgDate = new Date(img.date)
    return imgDate >= new Date('2099-01-01')
  })

  const value: ImagesContextType = {
    images,
    setImages,
    refreshImages,
    todayImage,
    scheduledImages,
    unscheduledImages,
  }

  return (
    <ImagesContext.Provider value={value}>
      {children}
    </ImagesContext.Provider>
  )
}

export function useImages(): ImagesContextType {
  const context = useContext(ImagesContext)
  if (context === undefined) {
    throw new Error('useImages must be used within an ImagesProvider')
  }
  return context
}