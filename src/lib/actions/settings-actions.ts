"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { getDefaultSettings } from "@/lib/settings"
import { prisma } from "../db"

// Settings schemas
const generalSettingsSchema = z.object({
  siteTitle: z.string().min(1, { message: "Site title is required" }),
  siteDescription: z.string().min(1, { message: "Site description is required" }),
  siteUrl: z.string().url({ message: "Please enter a valid URL" }),
  commentsEnabled: z.boolean().default(true),
})

const appearanceSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  darkModeDefault: z.boolean().default(false),
})

const emailSettingsSchema = z.object({
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  adminEmail: z.string().email({ message: "Please enter a valid email address" }),
  newCommentNotification: z.boolean().default(true),
  newUserNotification: z.boolean().default(true),
})

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>
export type AppearanceSettingsValues = z.infer<typeof appearanceSettingsSchema>
export type EmailSettingsValues = z.infer<typeof emailSettingsSchema>

// Get settings
export async function getSettings() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", settings: await getDefaultSettings() }
    }

    // Fetch settings from the database
    const settings = await prisma.settings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = await getDefaultSettings()

      // Create settings in the database
      await prisma.settings.create({
        data: {
          // General settings
          siteTitle: defaultSettings.general.siteTitle,
          siteDescription: defaultSettings.general.siteDescription,
          siteUrl: defaultSettings.general.siteUrl,
          commentsEnabled: defaultSettings.general.commentsEnabled,

          // Appearance settings
          primaryColor: defaultSettings.appearance.primaryColor,
          secondaryColor: defaultSettings.appearance.secondaryColor,
          darkModeDefault: defaultSettings.appearance.darkModeDefault,

          // Email settings
          fromEmail: defaultSettings.email.fromEmail,
          adminEmail: defaultSettings.email.adminEmail,
          newCommentNotification: defaultSettings.email.newCommentNotification,
          newUserNotification: defaultSettings.email.newUserNotification,
        },
      })

      return {
        success: true,
        settings: defaultSettings,
      }
    }

    // Format settings to match the expected structure
    const formattedSettings = {
      general: {
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        commentsEnabled: settings.commentsEnabled,
      },
      appearance: {
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        darkModeDefault: settings.darkModeDefault,
      },
      email: {
        fromEmail: settings.fromEmail,
        adminEmail: settings.adminEmail,
        newCommentNotification: settings.newCommentNotification,
        newUserNotification: settings.newUserNotification,
      },
    }

    return {
      success: true,
      settings: formattedSettings,
    }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      success: false,
      message: "Failed to fetch settings",
      settings: await getDefaultSettings(),
    }
  }
}

// Save general settings
export async function saveGeneralSettings(values: GeneralSettingsValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = generalSettingsSchema.parse(values)

    // Check if settings exist
    const existingSettings = await prisma.settings.findFirst()

    if (existingSettings) {
      // Update existing settings
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          siteTitle: validatedData.siteTitle,
          siteDescription: validatedData.siteDescription,
          siteUrl: validatedData.siteUrl,
          commentsEnabled: validatedData.commentsEnabled,
        },
      })
    } else {
      // Create new settings with defaults for other fields
      const defaultSettings = await getDefaultSettings()

      await prisma.settings.create({
        data: {
          // General settings (from form)
          siteTitle: validatedData.siteTitle,
          siteDescription: validatedData.siteDescription,
          siteUrl: validatedData.siteUrl,
          commentsEnabled: validatedData.commentsEnabled,

          // Default values for other settings
          primaryColor: defaultSettings.appearance.primaryColor,
          secondaryColor: defaultSettings.appearance.secondaryColor,
          darkModeDefault: defaultSettings.appearance.darkModeDefault,
          fromEmail: defaultSettings.email.fromEmail,
          adminEmail: defaultSettings.email.adminEmail,
          newCommentNotification: defaultSettings.email.newCommentNotification,
          newUserNotification: defaultSettings.email.newUserNotification,
        },
      })
    }

    // Revalidate relevant paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/blog")

    return { success: true, message: "General settings saved successfully" }
  } catch (error) {
    console.error("Error saving general settings:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Save appearance settings
export async function saveAppearanceSettings(values: AppearanceSettingsValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = appearanceSettingsSchema.parse(values)

    // Check if settings exist
    const existingSettings = await prisma.settings.findFirst()

    if (existingSettings) {
      // Update existing settings
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          primaryColor: validatedData.primaryColor,
          secondaryColor: validatedData.secondaryColor,
          darkModeDefault: validatedData.darkModeDefault,
        },
      })
    } else {
      // Create new settings with defaults for other fields
      const defaultSettings = await getDefaultSettings()

      await prisma.settings.create({
        data: {
          // Appearance settings (from form)
          primaryColor: validatedData.primaryColor,
          secondaryColor: validatedData.secondaryColor,
          darkModeDefault: validatedData.darkModeDefault,

          // Default values for other settings
          siteTitle: defaultSettings.general.siteTitle,
          siteDescription: defaultSettings.general.siteDescription,
          siteUrl: defaultSettings.general.siteUrl,
          commentsEnabled: defaultSettings.general.commentsEnabled,
          fromEmail: defaultSettings.email.fromEmail,
          adminEmail: defaultSettings.email.adminEmail,
          newCommentNotification: defaultSettings.email.newCommentNotification,
          newUserNotification: defaultSettings.email.newUserNotification,
        },
      })
    }

    // Revalidate relevant paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/blog")

    return { success: true, message: "Appearance settings saved successfully" }
  } catch (error) {
    console.error("Error saving appearance settings:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// Save email settings
export async function saveEmailSettings(values: EmailSettingsValues) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" }
    }

    // Validate form data
    const validatedData = emailSettingsSchema.parse(values)

    // Check if settings exist
    const existingSettings = await prisma.settings.findFirst()

    if (existingSettings) {
      // Update existing settings
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          fromEmail: validatedData.fromEmail,
          adminEmail: validatedData.adminEmail,
          newCommentNotification: validatedData.newCommentNotification,
          newUserNotification: validatedData.newUserNotification,
        },
      })
    } else {
      // Create new settings with defaults for other fields
      const defaultSettings = await getDefaultSettings()

      await prisma.settings.create({
        data: {
          // Email settings (from form)
          fromEmail: validatedData.fromEmail,
          adminEmail: validatedData.adminEmail,
          newCommentNotification: validatedData.newCommentNotification,
          newUserNotification: validatedData.newUserNotification,

          // Default values for other settings
          siteTitle: defaultSettings.general.siteTitle,
          siteDescription: defaultSettings.general.siteDescription,
          siteUrl: defaultSettings.general.siteUrl,
          commentsEnabled: defaultSettings.general.commentsEnabled,
          primaryColor: defaultSettings.appearance.primaryColor,
          secondaryColor: defaultSettings.appearance.secondaryColor,
          darkModeDefault: defaultSettings.appearance.darkModeDefault,
        },
      })
    }

    // Revalidate relevant paths
    revalidatePath("/admin")

    return { success: true, message: "Email settings saved successfully" }
  } catch (error) {
    console.error("Error saving email settings:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }

    return { success: false, message: "Something went wrong. Please try again." }
  }
}
