import { getCurrentSession } from "./auth/session"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await getCurrentSession()
  
  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/")
  }
  
  return session.user
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getCurrentSession()
    return session.user?.role === "ADMIN"
  } catch {
    return false
  }
}