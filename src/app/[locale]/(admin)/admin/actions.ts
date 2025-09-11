"use server"

import { z } from "zod"
import { actionClient } from "@/lib/client/safe-action"
import { requireAdmin } from "@/lib/server/dto"
import { prisma } from "@/lib/server/db"
import { revalidatePath } from "next/cache"
import type { LocalizedTips } from "@/types/tip"
import { Prisma } from "@prisma/client"
import { addDays, startOfDay, format } from "date-fns"

const uploadImageSchema = z.object({
  cloudinaryUrl: z.string().url(),
  year: z.number().int().min(1800).max(new Date().getFullYear()),
  description: z.string().optional(),
  tips: z.object({
    en: z.string().optional(),
    pt: z.string().optional(),
    fr: z.string().optional(),
    es: z.string().optional(),
    de: z.string().optional(),
    it: z.string().optional(),
  }).optional(),
})

export const uploadImage = actionClient
  .metadata({ actionName: "uploadImage" })
  .schema(uploadImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const unscheduledDate = new Date('2099-01-01')
    unscheduledDate.setDate(unscheduledDate.getDate() + Math.floor(Math.random() * 365))

    const image = await prisma.dailyImage.create({
      data: {
        cloudinaryUrl: parsedInput.cloudinaryUrl,
        year: parsedInput.year,
        description: parsedInput.description,
        tip: parsedInput.tips ? (parsedInput.tips as Prisma.InputJsonValue) : Prisma.JsonNull,
        date: unscheduledDate,
      }
    })

    revalidatePath("/admin/images")
    return { success: true, imageId: image.id }
  })

// Helper function to get next available date starting from today
async function getNextAvailableDate(startFromToday: boolean = true): Promise<Date> {
  const baseDate = startFromToday ? startOfDay(new Date()) : startOfDay(addDays(new Date(), 1))
  let checkDate = baseDate
  
  // Find the next date that doesn't have an image scheduled
  for (let i = 0; i < 365; i++) { // Safety limit
    const existing = await prisma.dailyImage.findFirst({
      where: { date: checkDate }
    })
    
    if (!existing) {
      return checkDate
    }
    
    checkDate = addDays(checkDate, 1)
  }
  
  // Fallback - this should never happen in normal use
  return addDays(baseDate, 365)
}

// QUEUE NEXT - Schedule image for the next available slot
const queueNextSchema = z.object({
  imageId: z.string(),
})

export const queueNext = actionClient
  .metadata({ actionName: "queueNext" })
  .schema(queueNextSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const nextDate = await getNextAvailableDate(true) // Start from today
    
    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: { date: nextDate }
    })

    revalidatePath("/admin")
    revalidatePath("/admin/images")
    revalidatePath("/daily")
    return { 
      success: true, 
      scheduledFor: format(nextDate, 'yyyy-MM-dd'),
      isToday: format(nextDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    }
  })

// QUEUE TOMORROW - Schedule image specifically for tomorrow (or next day if tomorrow is taken)
const queueTomorrowSchema = z.object({
  imageId: z.string(),
})

export const queueTomorrow = actionClient
  .metadata({ actionName: "queueTomorrow" })
  .schema(queueTomorrowSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const nextDate = await getNextAvailableDate(false) // Start from tomorrow
    
    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: { date: nextDate }
    })

    revalidatePath("/admin")
    revalidatePath("/admin/images")
    revalidatePath("/daily")
    return { 
      success: true, 
      scheduledFor: format(nextDate, 'yyyy-MM-dd')
    }
  })

const scheduleImageSchema = z.object({
  imageId: z.string(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  })
})

export const scheduleImage = actionClient
  .metadata({ actionName: "scheduleImage" })
  .schema(scheduleImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const targetDate = new Date(parsedInput.date)
    targetDate.setHours(0, 0, 0, 0)

    // Check if there's already an image scheduled for this date
    const existingImage = await prisma.dailyImage.findFirst({
      where: { date: targetDate }
    })

    if (existingImage && existingImage.id !== parsedInput.imageId) {
      // Move the existing image to unscheduled (far future date)
      const unscheduledDate = new Date('2099-01-01')
      unscheduledDate.setDate(unscheduledDate.getDate() + Math.floor(Math.random() * 365))

      await prisma.dailyImage.update({
        where: { id: existingImage.id },
        data: { date: unscheduledDate }
      })
    }

    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: { date: targetDate }
    })

    revalidatePath("/admin/images")
    return { success: true }
  })

const updateImageSchema = z.object({
  imageId: z.string(),
  description: z.string().optional(),
  tips: z.object({
    en: z.string().optional(),
    pt: z.string().optional(),
    fr: z.string().optional(),
    es: z.string().optional(),
    de: z.string().optional(),
    it: z.string().optional(),
  }).optional(),
})

export const updateImage = actionClient
  .metadata({ actionName: "updateImage" })
  .schema(updateImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: {
        description: parsedInput.description,
        tip: parsedInput.tips ? (parsedInput.tips as Prisma.InputJsonValue) : Prisma.JsonNull,
      }
    })

    revalidatePath("/admin/images")
    return { success: true }
  })

const deleteImageSchema = z.object({
  imageId: z.string(),
})

export const deleteImage = actionClient
  .metadata({ actionName: "deleteImage" })
  .schema(deleteImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const image = await prisma.dailyImage.findUnique({
      where: { id: parsedInput.imageId },
      include: { gameProgress: true }
    })

    if (!image) {
      throw new Error("Image not found")
    }

    if (image.gameProgress.length > 0) {
      throw new Error("Cannot delete image with existing game progress")
    }

    await prisma.dailyImage.delete({
      where: { id: parsedInput.imageId }
    })

    revalidatePath("/admin/images")
    return { success: true }
  })

export async function getAllImages() {
  await requireAdmin()

  return prisma.dailyImage.findMany({
    orderBy: { date: 'asc' }, // Changed to ascending for better queue view
    include: {
      _count: {
        select: {
          gameProgress: true
        }
      }
    }
  })
}

// Get the upcoming scheduled images (queue view)
export async function getUpcomingQueue() {
  await requireAdmin()
  
  const today = startOfDay(new Date())
  
  return prisma.dailyImage.findMany({
    where: {
      date: {
        gte: today,
        lt: new Date('2099-01-01')
      }
    },
    orderBy: { date: 'asc' },
    take: 14, // Show next 2 weeks
    include: {
      _count: {
        select: {
          gameProgress: true
        }
      }
    }
  })
}

// Get today's scheduled image
export async function getTodaysScheduledImage() {
  await requireAdmin()
  
  const today = startOfDay(new Date())
  
  return prisma.dailyImage.findFirst({
    where: { date: today },
    include: {
      _count: {
        select: {
          gameProgress: true
        }
      }
    }
  })
}

export async function getImageById(id: string) {
  await requireAdmin()

  return prisma.dailyImage.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          gameProgress: true
        }
      }
    }
  })
}

export async function getRandomUnscheduledImage() {
  await requireAdmin()

  const futureDate = new Date('2099-01-01')

  const unscheduledImages = await prisma.dailyImage.findMany({
    where: {
      date: {
        gte: futureDate
      }
    }
  })

  if (unscheduledImages.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * unscheduledImages.length)
  return unscheduledImages[randomIndex]
}

const bulkScheduleRandomSchema = z.object({
  startDate: z.string(),
  days: z.number().min(1).max(365),
})

export const bulkScheduleRandom = actionClient
  .metadata({ actionName: "bulkScheduleRandom" })
  .schema(bulkScheduleRandomSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const startDate = new Date(parsedInput.startDate)
    startDate.setHours(0, 0, 0, 0)

    const futureDate = new Date('2099-01-01')
    const unscheduledImages = await prisma.dailyImage.findMany({
      where: {
        date: {
          gte: futureDate
        }
      }
    })

    if (unscheduledImages.length === 0) {
      throw new Error("No unscheduled images available")
    }

    // Get existing scheduled images for the date range to handle conflicts
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + parsedInput.days - 1)

    const existingScheduledImages = await prisma.dailyImage.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    const operations = []

    // First, move any existing scheduled images in the date range to unscheduled
    for (const existingImage of existingScheduledImages) {
      const unscheduledDate = new Date('2099-01-01')
      unscheduledDate.setDate(unscheduledDate.getDate() + Math.floor(Math.random() * 365))

      operations.push(
        prisma.dailyImage.update({
          where: { id: existingImage.id },
          data: { date: unscheduledDate }
        })
      )
    }

    // Then schedule new random images
    for (let i = 0; i < parsedInput.days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const randomImage = unscheduledImages[Math.floor(Math.random() * unscheduledImages.length)]

      operations.push(
        prisma.dailyImage.update({
          where: { id: randomImage.id },
          data: { date: currentDate }
        })
      )

      const index = unscheduledImages.indexOf(randomImage)
      unscheduledImages.splice(index, 1)

      if (unscheduledImages.length === 0) {
        break
      }
    }

    await prisma.$transaction(operations)

    revalidatePath("/admin/images")
    return { success: true, scheduled: parsedInput.days }
  })