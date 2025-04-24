import { getSettings } from "@/lib/actions/settings-actions"
import type React from "react"
import Image from "next/image"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const appSettings = await getSettings()
  const appGeneralSettings = appSettings.settings.general
  // console.log("Settings: ", appSettings)

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen grid md:grid-cols-2">
          <div className="hidden md:block relative">
            <Image
              src="/nature.jpg?height=1080&width=1920"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-stone-900/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
              <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold mb-6">{appGeneralSettings.siteTitle}</h1>
                <p className="text-lg mb-8">{appGeneralSettings.siteDescription}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </body>
    </html>
  )
}
