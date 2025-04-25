"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { getReadingTime, slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import {
  getMockPosts,
  getMockPostBySlug,
  getMockRelatedPosts,
  getMockCategories,
  getMockRecentPosts,
} from "@/lib/mock-data"
import { Category, Post } from "@/types/types"
import { getCurrentUser } from "../auth"
import { PostFormValues, postSchema } from "../validations"

interface GetPostsOptions {
  page?: number
  limit?: number
  category?: string
  search?: string
  featured?: boolean
}

export async function getPosts(options: GetPostsOptions = {}): Promise<{ posts: Post[]; totalPages: number }> {
  try {
    const { page = 1, limit = 10, category, search, featured } = options

    const skip = (page - 1) * limit

    // Build the where clause based on options
    const where: any = {
      published: true,
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    if (category) {
      where.categories = {
        some: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalPosts = await prisma.post.count({ where })
    const totalPages = Math.ceil(totalPosts / limit)

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
    })

    // Transform the data to match our types
    const transformedPosts: Post[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || undefined,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      published: post.published,
      featured: post.featured,
      readingTime: getReadingTime(post.content),
      categories: post.categories.map((c) => c.name),
      tags: post.tags.map((t) => t.name),
      author: {
        id: post.author.id,
        name: post.author.name || "",
        image: post.author.image || undefined,
      },
    }))

    return {
      posts: transformedPosts,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    // Return mock data as fallback
    return getMockPosts(options)
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post) return getMockPostBySlug(slug)

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || undefined,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      published: post.published,
      featured: post.featured,
      readingTime: getReadingTime(post.content),
      categories: post.categories.map((c) => c.name),
      tags: post.tags.map((t) => t.name),
      author: {
        id: post.author.id,
        name: post.author.name || "",
        image: post.author.image || undefined,
      },
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    // Return mock data as fallback
    return getMockPostBySlug(slug)
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
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

    return categories.map((category) => ({
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

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    })

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || undefined,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      published: post.published,
      featured: post.featured,
      readingTime: getReadingTime(post.content),
      categories: [],
      tags: [],
      author: {
        id: post.author.id,
        name: post.author.name || "",
        image: post.author.image || undefined,
      },
    }))
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    // Return mock data as fallback
    return getMockRecentPosts(limit)
  }
}

export async function getRelatedPosts(postId: string, categories: string[]): Promise<Post[]> {
  try {
    if (!categories.length) return []

    const posts = await prisma.post.findMany({
      where: {
        id: {
          not: postId,
        },
        published: true,
        categories: {
          some: {
            name: {
              in: categories,
            },
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
    })

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || undefined,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      published: post.published,
      featured: post.featured,
      readingTime: getReadingTime(post.content),
      categories: post.categories.map((c) => c.name),
      tags: post.tags.map((t) => t.name),
      author: {
        id: post.author.id,
        name: post.author.name || "",
        image: post.author.image || undefined,
      },
    }))
  } catch (error) {
    console.error("Error fetching related posts:", error)
    // Return mock data as fallback
    return getMockRelatedPosts(postId, categories)
  }
}


export async function createPost(values: PostFormValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = postSchema.parse(values)

    // Generate slug from title
    const slug = slugify(validatedData.title)

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return { success: false, message: "A post with this title already exists" }
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        featured: validatedData.featured,
        author: {
          connect: {
            id: user.id,
          },
        },
        categories: {
          connectOrCreate: validatedData.categories.map((category) => ({
            where: { name: category },
            create: { name: category, slug: slugify(category) },
          })),
        },
        tags: {
          connectOrCreate: (validatedData.tags || []).map((tag) => ({
            where: { name: tag },
            create: { name: tag, slug: slugify(tag) },
          })),
        },
      },
    })

    revalidatePath("/blog")
    revalidatePath("/admin")
    revalidatePath("/")
    

    return { success: true, message: "Post created successfully", post }
  } catch (error) {
    console.error("Error creating post:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function updatePost(postId: string, values: PostFormValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = postSchema.parse(values)

    // Get existing post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        tags: true,
      },
    })

    if (!existingPost) {
      return { success: false, message: "Post not found" }
    }

    // Generate slug from title if title changed
    let slug = existingPost.slug
    if (existingPost.title !== validatedData.title) {
      slug = slugify(validatedData.title)

      // Check if new slug already exists
      const slugExists = await prisma.post.findFirst({
        where: {
          slug,
          id: { not: postId },
        },
      })

      if (slugExists) {
        return { success: false, message: "A post with this title already exists" }
      }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: validatedData.title,
        slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        featured: validatedData.featured,
        categories: {
          disconnect: existingPost.categories.map((c) => ({ id: c.id })),
          connectOrCreate: validatedData.categories.map((category) => ({
            where: { name: category },
            create: { name: category, slug: slugify(category) },
          })),
        },
        tags: {
          disconnect: existingPost.tags.map((t) => ({ id: t.id })),
          connectOrCreate: (validatedData.tags || []).map((tag) => ({
            where: { name: tag },
            create: { name: tag, slug: slugify(tag) },
          })),
        },
      },
    })

    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/admin")
    revalidatePath("/")
    

    return { success: true, message: "Post updated successfully", post }
  } catch (error) {
    console.error("Error updating post:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function deletePost(postId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Delete post
    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath("/blog")
    revalidatePath("/admin")
    revalidatePath("/")


    return { success: true, message: "Post deleted successfully" }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
