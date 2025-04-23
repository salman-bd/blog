"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, MoreHorizontal, Plus, Search, Trash, Loader2, AlertCircle, Upload } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useDebouncedCallback } from "use-debounce"
import { createPost, updatePost, deletePost, getPosts } from "@/lib/actions/post-actions"
import { getCategories } from "@/lib/actions/category-actions"
import { mockPosts, mockCategories } from "@/lib/mock-data"
import { MultiSelect } from "@/components/ui/multi-select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "../ui/use-toast"
import { PostFormValues, postSchema } from "@/lib/validations"
import Image from "next/image"
import axios from "axios"


export function PostsTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPostId, setCurrentPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  // Initialize form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      featured: false,
      categories: [],
      tags: [],
    },
  })

  // Load posts and categories on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch posts and categories
        const [postsData, categoriesData] = await Promise.all([getPosts({ limit: 100 }), getCategories()])

        setPosts(postsData.posts || [])
        setFilteredPosts(postsData.posts || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error("Error loading posts data:", error)
        setError("Failed to load posts. Using mock data instead.")

        // Use mock data as fallback
        setPosts(mockPosts)
        setFilteredPosts(mockPosts)
        setCategories(mockCategories)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Debounced search function
  const debouncedSearch = useDebouncedCallback((value) => {
    if (!value.trim()) {
      setFilteredPosts(posts)
      return
    }

    const searchTerm = value.toLowerCase()
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.categories.some((category: string) => category.toLowerCase().includes(searchTerm)),
    )

    setFilteredPosts(results)
  }, 300)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Open dialog to create a new post
  const handleNewPost = () => {
    form.reset({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      featured: false,
      categories: [],
      tags: [],
    })
    setTagInput("")
    setIsEditMode(false)
    setCurrentPostId(null)
    setIsPostDialogOpen(true)
  }

  // Open dialog to edit an existing post
  const handleEditPost = (post: any) => {
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      published: post.published,
      featured: post.featured,
      categories: post.categories,
      tags: post.tags,
    })
    setTagInput(post.tags.join(", "))
    setIsEditMode(true)
    setCurrentPostId(post.id)
    setIsPostDialogOpen(true)
  }

  // Open dialog to confirm post deletion
  const handleDeleteClick = (postId: string) => {
    setCurrentPostId(postId)
    setIsDeleteDialogOpen(true)
  }

  // Delete a post
  const handleDeletePost = async () => {
    if (!currentPostId) return

    try {
      setIsSubmitting(true)
      const result = await deletePost(currentPostId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Remove the deleted post from state
        setPosts(posts.filter((post) => post.id !== currentPostId))
        setFilteredPosts(filteredPosts.filter((post) => post.id !== currentPostId))
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
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setCurrentPostId(null)
    }
  }

  // Handle tag input change
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)

    // Update form value
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    form.setValue("tags", tags)
  }

  // Submit form to create or update a post
  const onSubmit = async (values: PostFormValues) => {
    try {
      setIsSubmitting(true)

      let result
      if (isEditMode && currentPostId) {
        // Update existing post
        result = await updatePost(currentPostId, values)
      } else {
        // Create new post
        result = await createPost(values)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default"
        })

        // Refresh posts data
        const postsData = await getPosts({ limit: 100 })
        setPosts(postsData.posts || [])
        setFilteredPosts(postsData.posts || [])

        // Close dialog
        setIsPostDialogOpen(false)
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
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format categories for MultiSelect component
  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }))

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Exceeds image size",
        description: "File size exceeds 5MB. Please choose a smaller file",
        variant: "destructive",
      })
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    try {
      setImageUploading(true)
      const response = await axios.post("/api/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (!response.data.success) {
        toast({
          title: "Image Uploading Failed",
          description: response.data.message,
          variant: "destructive",
        })
        throw new Error(response.data.message || "Failed to add the image")
      }
      form.setValue("coverImage", response.data.url)
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Image uploading failed",
        description: "Something went wrong uploading image",
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Posts</h2>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleNewPost}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"} for "{searchQuery}"
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No posts found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link href={`/blog/${post.slug}`} className="hover:text-amber-600" target="_blank">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="flex flex-col justify-start items-center gap-2">
                      <Badge
                        variant={post.published ? "default" : "outline"}
                        className={
                          post.published
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400"
                            : ""
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-400">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map((category: string) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-400"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{post.publishedAt ? formatDate(post.publishedAt) : "—"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(post.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Post Form Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of your existing post."
                : "Fill in the details to create a new blog post."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief summary of the post" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormDescription>A short summary that appears on blog listings.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your post content here..." className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormDescription>Supports HTML formatting for rich content.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <div className="space-y-4">
                      {field.value && (
                        <div className="relative w-full max-w-md h-48 rounded-md overflow-hidden border mx-auto">
                          <Image
                            src={field.value || "/placeholder.svg"}
                            fill
                            alt="article-image"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Input type="text" placeholder="Image URL" {...field} className="hidden" />
                        </FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Button type="button" variant="outline">
                            {imageUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-600" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <FormDescription>Upload an image for your article (max 5MB, JPG, PNG or WebP)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={categoryOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select categories"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="tag1, tag2, tag3" value={tagInput} onChange={handleTagInputChange} />
                      </FormControl>
                      <FormDescription>Comma-separated list of tags.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>Make this post visible to readers.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>Highlight this post on the homepage.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPostDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update Post"
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
