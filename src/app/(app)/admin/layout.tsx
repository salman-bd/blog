import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

// Add this line to force dynamic rendering for all admin routes
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  // console.log('User: ', user);

  if (!user || user.role !== "ADMIN") {
    redirect("/admin-signin?callbackUrl=/admin")
  }

  return (
    <div className="min-h-screen dark:bg-stone-700 bg-gray-100 w-full flex-1">
      <div className="flex items-center justify-center mx-auto w-full">{children}</div>
    </div>
  )
}
