import type React from "react"
import { ThemeProvider } from "@/app/context/theme-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen grid md:grid-cols-2">
            <div className="hidden md:block relative bg-amber-600">
              <div className="absolute inset-0 bg-stone-900/20" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
                <div className="max-w-md text-center">
                  <h1 className="text-3xl font-bold mb-6">Welcome to Junayed Ahmed's Blog</h1>
                  <p className="text-lg mb-8">
                    Join me on a journey through travel, politics, religion, history, and nature.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-4 md:p-8">
              <div className="w-full max-w-md">
                {children}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
