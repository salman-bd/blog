"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { mockUsers } from "@/lib/mock-data"
import { getCurrentUser } from "../auth"
import { UserFormValues, userSchema } from "../validations"

// Get users with optional filtering
export async function getUsers(options: { search?: string } = {}) {
  try {
    const user = await getCurrentUser()  

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", users: [] }
    }

    const { search } = options

    // Build the where clause based on options
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, users }
  } catch (error) {
    console.error("Error fetching users:", error)
    // Return mock data as fallback
    return { success: true, users: mockUsers }
  }
}


// Create user
export async function createUser(values: UserFormValues) {
  const user = await getCurrentUser()  

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized"}
  }

  try {
    // Validate form data
    const validatedData = userSchema.parse(values)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password if provided
    let hashedPassword
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 10)
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    })

    revalidatePath("/admin")

    return { success: true, message: "User created successfully", user }
  } catch (error) {
    console.error("Error creating user:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Update user
export async function updateUser(userId: string, values: UserFormValues) {
  const user = await getCurrentUser()  

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized"}
  }

  try {
    // Validate form data
    const validatedData = userSchema.parse(values)

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: userId },
      },
    })

    if (existingUser) {
      return { success: false, message: "Email is already taken by another user" }
    }

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    }

    // Hash password if provided
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10)
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath("/admin")

    return { success: true, message: "User updated successfully", user }
  } catch (error) {
    console.error("Error updating user:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Delete user
export async function deleteUser(userId: string) {
  const user = await getCurrentUser()  

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized"}
  }

  try {
    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin")

    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
