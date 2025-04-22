"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Plus, Trash, Loader2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  type CategoryFormValues,
} from "@/lib/actions/category-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
})

export function CategoriesTab() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // Load categories on component mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch categories
        const data = await getCategories()
        setCategories(data || [])
      } catch (error) {
        console.error("Error loading categories:", error)
        setError("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Open dialog to create a new category
  const handleNewCategory = () => {
    form.reset({
      name: "",
    })
    setIsAddDialogOpen(true)
  }

  // Open dialog to edit an existing category
  const handleEditCategory = (category: any) => {
    form.reset({
      name: category.name,
    })
    setCurrentCategoryId(category.id)
    setIsEditDialogOpen(true)
  }

  // Open dialog to confirm category deletion
  const handleDeleteClick = (categoryId: string) => {
    setCurrentCategoryId(categoryId)
    setIsDeleteDialogOpen(true)
  }

  // Create a new category
  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      setIsSubmitting(true)
      const result = await createCategory(values)

      if (!result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsAddDialogOpen(false)

        // Add the new category to the list
        if (result.category) {
          setCategories([...categories, result.category])
        } else {
          // Refresh categories if we don't have the new category data
          const refreshedCategories = await getCategories()
          setCategories(refreshedCategories || [])
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
      toast({
        title: "Success",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update an existing category
  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (!currentCategoryId) return

    try {
      setIsSubmitting(true)
      const result = await updateCategory(currentCategoryId, values)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsEditDialogOpen(false)

        // Update the category in the list
        if (result.category) {
          setCategories(categories.map((category) => (category.id === currentCategoryId ? result.category : category)))
        } else {
          // Refresh categories if we don't have the updated category data
          const refreshedCategories = await getCategories()
          setCategories(refreshedCategories || [])
        }
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
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a category
  const handleDeleteCategory = async () => {
    if (!currentCategoryId) return

    try {
      setIsSubmitting(true)
      const result = await deleteCategory(currentCategoryId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsDeleteDialogOpen(false)

        // Remove the deleted category from the list
        setCategories(categories.filter((category) => category.id !== currentCategoryId))
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
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleNewCategory}>
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

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
          ) : categories.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id || category.name}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(category.id)}>
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

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category for your blog posts.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Category"
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
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
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
