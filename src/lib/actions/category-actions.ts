"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils"
import { getMockCategories } from "@/lib/mock-data"
import { getCurrentUser } from "../auth"
import { Category } from "@/types/types"

const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    })

    return categories.map((category: Category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category._count.posts,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return mock data as fallback
    return getMockCategories()
  }
}

export async function createCategory(values: CategoryFormValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = categorySchema.parse(values)

    // Generate slug from name
    const slug = slugify(validatedData.name)

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug }],
      },
    })

    if (existingCategory) {
      return { success: false, message: "Category already exists" }
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
      },
    })

    revalidatePath("/admin")
    revalidatePath("/blog")

    return { success: true, message: "Category created successfully", category }
  } catch (error) {
    console.error("Error creating category:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function updateCategory(categoryId: string, values: CategoryFormValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = categorySchema.parse(values)

    // Generate slug from name
    const slug = slugify(validatedData.name)

    // Check if category already exists with this name/slug (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug }],
        id: { not: categoryId },
      },
    })

    if (existingCategory) {
      return { success: false, message: "Category already exists" }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        slug,
      },
    })

    revalidatePath("/admin")
    revalidatePath("/blog")

    return { success: true, message: "Category updated successfully", category }
  } catch (error) {
    console.error("Error updating category:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Check if category is used in any posts
    const postsWithCategory = await prisma.post.count({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    })

    if (postsWithCategory > 0) {
      return { success: false, message: "Cannot delete category that is used in posts" }
    }

    // Delete category
    await prisma.category.delete({
      where: { id: categoryId },
    })

    revalidatePath("/admin")
    revalidatePath("/blog")

    return { success: true, message: "Category deleted successfully" }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
