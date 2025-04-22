"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { sendContactConfirmationEmail, sendAdminNotificationEmail, sendContactReplyEmail } from "@/lib/sendEmail"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// Reply form schema
const replyFormSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type ReplyFormValues = z.infer<typeof replyFormSchema>

export async function submitContactForm(values: ContactFormValues) {
  try {
    // Validate form data
    const validatedData = contactFormSchema.parse(values)

    // Store contact message in database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "unread",
      },
    })

    // Send confirmation email to the user
    await sendContactConfirmationEmail(validatedData.email, validatedData.name, validatedData.subject)

    // Send notification email to admin
    await sendAdminNotificationEmail(
      validatedData.name,
      validatedData.email,
      validatedData.subject,
      validatedData.message,
    )

    revalidatePath("/contact")

    return { success: true, message: "Your message has been sent successfully. We'll get back to you soon." }
  } catch (error) {
    console.error("Error submitting contact form:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Mark contact as read
export async function markContactAsRead(contactId: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.contact.update({
      where: { id: contactId },
      data: { status: "read" },
    })

    revalidatePath("/admin")

    return { success: true, message: "Contact marked as read" }
  } catch (error) {
    console.error("Error marking contact as read:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Get all contacts
export async function getContacts(options: { page?: number; limit?: number; status?: string } = {}) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized",
        contacts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        },
      }
    }

    const { page = 1, limit = 10, status } = options
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get contacts with pagination
    const [contacts, totalCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
    }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return {
      success: false,
      message: "Failed to fetch contacts",
      contacts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
    }
  }
}

// Update contact status
export async function updateContactStatus(id: string, status: "READ" | "UNREAD" | "ARCHIVED") {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.contact.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/admin/contacts")
    return { success: true, message: "Contact status updated" }
  } catch (error) {
    console.error("Error updating contact status:", error)
    return { success: false, message: "Failed to update contact status" }
  }
}

// Delete contact
export async function deleteContact(id: string) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    await prisma.contact.delete({
      where: { id },
    })

    revalidatePath("/admin/contacts")
    return { success: true, message: "Contact deleted" }
  } catch (error) {
    console.error("Error deleting contact:", error)
    return { success: false, message: "Failed to delete contact" }
  }
}

// Reply to contact
export async function replyToContact(contactId: string, values: ReplyFormValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = replyFormSchema.parse(values)

    // Get contact details
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!contact) {
      return { success: false, message: "Contact not found" }
    }

    // Update contact status to READ
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        status: "READ",
        replied: true,
        repliedAt: new Date(),
      },
    })

    // Send reply email
    await sendContactReplyEmail(contact.email, contact.name, contact.subject, contact.message, validatedData.subject, validatedData.message)

    revalidatePath("/admin/contacts")
    return { success: true, message: "Reply sent successfully" }
  } catch (error) {
    console.error("Error replying to contact:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}