"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { getCategories, getRecentPosts } from "@/lib/actions/post-actions"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { getMockCategories, getMockRecentPosts } from "@/lib/mock-data"
import { useDebouncedCallback } from "use-debounce"
import { subscribeToNewsletter, type SubscribeFormValues } from "@/lib/actions/subscribe-actions"

// Define types for categories and posts
interface Category {
  id: string
  name: string
  slug: string
  count: number
}

interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
}

const searchSchema = z.object({
  query: z.string().min(1, { message: "Please enter a search term" }),
})

type SearchFormValues = z.infer<typeof searchSchema>

const subscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export function BlogSidebar() {
  // Properly type the state variables
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch data from API
        const [categoriesData, recentPostsData] = await Promise.all([getCategories(), getRecentPosts(5)])

        // Set state with properly typed data
        setCategories(categoriesData as Category[])
        setRecentPosts(recentPostsData as Post[])
      } catch (error) {
        console.error("Error loading sidebar data:", error)
        // Use mock data as fallback
        setCategories(getMockCategories() as Category[])
        setRecentPosts(getMockRecentPosts(5) as Post[])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SearchBox />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id || category.name} href={`/blog/category/${category.slug}`}>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-400 dark:hover:bg-stone-700"
                >
                  {category.name} ({category.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                <Link href={`/blog/${post.slug}`} className="hover:text-amber-600">
                  <h3 className="font-medium line-clamp-2">{post.title}</h3>
                </Link>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SubscribeBox />
    </div>
  )
}

function SearchBox() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  })

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.trim().length > 0) {
      router.push(`/blog?search=${encodeURIComponent(value.trim())}`)
    }
  }, 500)

  function onSubmit(values: SearchFormValues) {
    setIsSubmitting(true)
    router.push(`/blog?search=${encodeURIComponent(values.query.trim())}`)
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search posts..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debouncedSearch(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function SubscribeBox() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: SubscribeFormValues) {
    setIsSubmitting(true)

    try {
      const result = await subscribeToNewsletter(values)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Subscribe</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Get notified when new posts are published.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
