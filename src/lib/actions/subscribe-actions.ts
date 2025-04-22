"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { sendSubscriptionConfirmationEmail } from "@/lib/sendEmail"
import { revalidatePath } from "next/cache"

// Subscribe form schema
const subscribeFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export type SubscribeFormValues = z.infer<typeof subscribeFormSchema>

export async function subscribeToNewsletter(values: SubscribeFormValues) {
  try {
    // Validate form data
    const validatedData = subscribeFormSchema.parse(values)

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: validatedData.email },
    })

    if (existingSubscriber) {
      return { success: false, message: "This email is already subscribed to our newsletter." }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email: validatedData.email,
        status: "active",
      },
    })

    // Send confirmation email
    await sendSubscriptionConfirmationEmail(validatedData.email)

    revalidatePath("/blog")

    return { success: true, message: "You have been successfully subscribed to our newsletter!" }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string, token: string) {
  try {
    // Verify token (in a real app, you would validate this token)
    // For simplicity, we're skipping token validation here

    // Update subscriber status
    await prisma.subscriber.update({
      where: { email },
      data: { status: "unsubscribed" },
    })

    return { success: true, message: "You have been successfully unsubscribed from our newsletter." }
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Get all subscribers
export async function getSubscribers(options: { page?: number; limit?: number; status?: string } = {}) {
  try {
    const { page = 1, limit = 10, status } = options
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get subscribers with pagination
    const [subscribers, totalCount] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      subscribers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
    }
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return {
      success: false,
      message: "Failed to fetch subscribers",
      subscribers: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
    }
  }
}

// Delete subscriber
export async function deleteSubscriber(subscriberId: string) {
  try {
    await prisma.subscriber.delete({
      where: { id: subscriberId },
    })

    revalidatePath("/admin")

    return { success: true, message: "Subscriber deleted successfully" }
  } catch (error) {
    console.error("Error deleting subscriber:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
