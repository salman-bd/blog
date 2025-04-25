import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { getCategories } from "@/lib/actions/category-actions"
import { Category } from "@/types/types"

export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="border-t bg-stone-50 dark:bg-stone-900">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-amber-600">Blogger</span>
            </Link>
            <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
              A government employee in Bangladesh with a passion for traveling and exploring new places.
            </p>
            <div className="mt-4 flex space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:junayed@example.com">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Quick Links</h3>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/blog" className="text-sm hover:text-amber-600">
                Blog
              </Link>
              <Link href="/about" className="text-sm hover:text-amber-600">
                About
              </Link>
              <Link href="/contact" className="text-sm hover:text-amber-600">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-sm hover:text-amber-600">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm hover:text-amber-600">
                Terms of Service
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-medium">Categories</h3>
            <nav className="mt-4 flex flex-col space-y-2">
              {categories.map((category: Category) => 
                <div key={category.id}>
                  <Link href={`/blog/category/${category.name.toLowerCase()}`} className="text-sm hover:text-amber-600">
                    {category.name}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              &copy; {new Date().getFullYear()} Blogger. All rights reserved.
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Developed by: <Link href='https://www.salmanbd.com/' target="_blank"><strong><span className="hover:text-stone-500">Md. Abu Salman</span></strong> </Link> 
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-600 mt-4 md:mt-0"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
