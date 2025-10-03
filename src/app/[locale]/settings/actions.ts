"use server"

import { z } from "zod"
import { getCurrentSession } from "@/lib/server/auth/session"
import { prisma } from "@/lib/server/db"
import { revalidatePath } from "next/cache"

const updateSettingsSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  picture: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
})

export async function updateSettings(data: z.infer<typeof updateSettingsSchema>) {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      }
    }

    const validatedData = updateSettingsSchema.parse(data)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        picture: validatedData.picture || null,
      },
    })

    revalidatePath("/")
    revalidatePath("/settings")

    return {
      success: true,
      data: updatedUser,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data",
      }
    }

    return {
      success: false,
      error: "Failed to update settings. Please try again.",
    }
  }
}