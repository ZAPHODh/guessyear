"use server"

import { z } from "zod"
import { actionClient } from "@/lib/client/safe-action"
import { requireAdmin } from "@/lib/server/dto"
import { prisma } from "@/lib/server/db"
import { revalidatePath } from "next/cache"

const uploadImageSchema = z.object({
  cloudinaryUrl: z.string().url(),
  year: z.number().int().min(1800).max(new Date().getFullYear()),
  description: z.string().optional(),
})

export const uploadImage = actionClient
  .metadata({ actionName: "uploadImage" })
  .schema(uploadImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const image = await prisma.dailyImage.create({
      data: {
        cloudinaryUrl: parsedInput.cloudinaryUrl,
        year: parsedInput.year,
        description: parsedInput.description,
        date: new Date(), // Temporary date, will be updated when scheduled
      }
    })

    revalidatePath("/admin/images")
    return { success: true, imageId: image.id }
  })

const setTodayImageSchema = z.object({
  imageId: z.string(),
})

export const setTodayImage = actionClient
  .metadata({ actionName: "setTodayImage" })
  .schema(setTodayImageSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: { date: today }
    })

    revalidatePath("/admin")
    revalidatePath("/daily")
    return { success: true }
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

    await prisma.dailyImage.update({
      where: { id: parsedInput.imageId },
      data: { date: targetDate }
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
    orderBy: { date: 'desc' },
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

    const updates = []
    for (let i = 0; i < parsedInput.days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const randomImage = unscheduledImages[Math.floor(Math.random() * unscheduledImages.length)]

      updates.push(
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

    await prisma.$transaction(updates)

    revalidatePath("/admin/images")
    return { success: true, scheduled: updates.length }
  })