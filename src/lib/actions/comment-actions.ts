"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getMockComments } from "@/lib/mock-data"
import { getCurrentUser } from "../auth"

const commentSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(1000, { message: "Comment is too long" }),
})

export type CommentFormValues = z.infer<typeof commentSchema>

export async function submitComment(values: CommentFormValues, postId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "You must be logged in to comment" }
    }

    // Validate form data
    const validatedData = commentSchema.parse(values)

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    revalidatePath(`/blog/${postId}`)

    return { success: true, message: "Comment submitted successfully", comment }
  } catch (error) {
    console.error("Failed to submit comment:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, comments }
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    // Return mock data as fallback
    return { success: true, comments: getMockComments(postId) }
  }
}

export async function getAllComments(options: { page?: number; limit?: number } = {}) {
  try {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.comment.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
    }
  } catch (error) {
    console.error("Failed to fetch all comments:", error)
    // Return mock data as fallback
    return {
      success: true,
      comments: getMockComments(""),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: getMockComments("").length,
      },
    }
  }
}

export async function approveComment(commentId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { status: "approved" },
    })

    revalidatePath("/admin")

    return { success: true, message: "Comment approved successfully" }
  } catch (error) {
    console.error("Failed to approve comment:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function unapproveComment(commentId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { status: "pending" },
    })

    revalidatePath("/admin")

    return { success: true, message: "Comment unapproved successfully" }
  } catch (error) {
    console.error("Failed to unapprove comment:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    revalidatePath("/admin")

    return { success: true, message: "Comment deleted successfully" }
  } catch (error) {
    console.error("Failed to delete comment:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
