"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "@/lib/client/safe-action";
import { deleteSessionTokenCookie } from "@/lib/server/auth/cookies";
import { invalidateSession } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { z } from "zod";

export const logout = authActionClient
    .metadata({ actionName: "logout" })
    .action(async ({ ctx }) => {
        await invalidateSession(ctx.sessionId);
        deleteSessionTokenCookie();
        revalidatePath("/");
        redirect("/");
    });

const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    picture: z.string().optional()
});

export const updateUserProfile = authActionClient
    .metadata({ actionName: "updateUserProfile" })
    .schema(updateProfileSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { name, picture } = parsedInput;

        try {
            const updatedUser = await prisma.user.update({
                where: { id: ctx.userId },
                data: {
                    name,
                    ...(picture && { picture })
                }
            });

            revalidatePath("/");

            return {
                success: true,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    picture: updatedUser.picture
                }
            };
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new Error("Failed to update profile");
        }
    });
