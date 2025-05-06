'use client'

import type React from "react"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // console.log('User: ', user);
  const { data: session} = useSession()
 
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin-signin?callbackUrl=/admin")
  }

  return (
    <div className="min-h-screen dark:bg-stone-700 bg-gray-100 w-full flex-1">
      <div className="flex items-center justify-center mx-auto w-full">{children}</div>
    </div>
  )
}