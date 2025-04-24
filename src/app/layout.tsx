import type React from "react"
import "@/styles/globals.css"
import { ThemeProvider } from "@/app/context/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { ubuntu } from "@/components/ui/font"
import { getSettings } from "@/lib/actions/settings-actions"
import { SessionProvider } from "./context/session-provider"

export const metadata: Metadata = {
  title: "Blogger | Personal Blog",
  description: "Personal blog, sharing thoughts on travel, politics, religion, history, and nature.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const appSettings = await getSettings()
  const appAppearanceSettings = appSettings.settings.appearance
  // console.log('Settings: ', appSettings);
  // console.log('App theme: ', appAppearanceSettings);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={appAppearanceSettings.darkModeDefault ? "dark" : "light"}
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              <Header appearanceSettings={appAppearanceSettings} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
