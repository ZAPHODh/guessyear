"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "@/lib/client/safe-action";
import { deleteSessionTokenCookie } from "@/lib/server/auth/cookies";
import { invalidateSession } from "@/lib/server/auth/session";

export const logout = authActionClient
    .metadata({ actionName: "logout" })
    .action(async ({ ctx }) => {
        await invalidateSession(ctx.sessionId);
        deleteSessionTokenCookie();
        revalidatePath("/");
        redirect("/");
    });
