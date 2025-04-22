import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    return session?.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

