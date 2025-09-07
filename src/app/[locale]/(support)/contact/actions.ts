"use server";

import { z } from "zod";
import { actionClient } from "@/lib/client/safe-action";
import { getCurrentSession } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { sendSupportConfirmation } from "@/lib/server/mail";

const supportMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const submitSupportMessage = actionClient
  .metadata({ actionName: "submitSupportMessage" })
  .schema(supportMessageSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      const { session, user } = await getCurrentSession();

      const supportMessage = await prisma.supportMessage.create({
        data: {
          userId: user?.id || null,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: "open",
        },
      });

      try {
        await sendSupportConfirmation({
          toMail: data.email,
          userName: data.name,
          subject: data.subject,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      return {
        success: true,
        messageId: supportMessage.id,
        message: "Support message submitted successfully",
      };
    } catch (error) {
      console.error("Error submitting support message:", error);
      throw new Error("Failed to submit support message. Please try again.");
    }
  });