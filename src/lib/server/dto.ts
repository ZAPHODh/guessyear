'use server';

import { getCurrentSession } from "./auth/session"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const { user } = await getCurrentSession()

  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }

  return user
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { user } = await getCurrentSession()
    return user?.role === "ADMIN"
  } catch {
    return false
  }
}