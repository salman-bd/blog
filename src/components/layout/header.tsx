"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/app/context/mode-toggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { AppAppearanceSettings } from "@/types/types"
import { useTheme } from "next-themes"

interface HeaderProps {
  appearanceSettings: AppAppearanceSettings
}

export function Header({ appearanceSettings }: HeaderProps) {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (appearanceSettings.darkModeDefault) {
    setTheme("dark")
  } else {
    setTheme("light")
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between  max-w-7xl mx-auto px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-amber-600">Blogger</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                pathname === route.href ? "text-amber-600" : "text-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
          {/* <ModeToggle /> */}
        </nav>

        <div className="flex items-center justify-center md:hidden">
          {/* <ModeToggle /> */}
          <Button variant="ghost" size="icon"  onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>


        </div>


        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-amber-600">Junayed Ahmed</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="container grid gap-6 py-6 bg-white dark:bg-stone-800">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-lg font-medium transition-colors hover:text-amber-600 ${
                    pathname === route.href ? "text-amber-600" : "text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
