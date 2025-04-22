import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/signin?callbackUrl=/admin")
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full flex-1">
      <div className="flex items-center justify-center mx-auto w-full">{children}</div>
    </div>
  )
}