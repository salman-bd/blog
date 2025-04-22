import { z } from "zod"

// User authentication schemas
export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const verificationSchema = z.object({
  token: z.string().min(1, { message: "Verification token is required" }),
})

// User schema
export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  role: z.enum(["user", "admin"]),
})


// Form schema for post creation/editing
export const postSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
  tags: z.array(z.string()).optional(),
})

// Comment schemas
export const commentSchema = z.object({
  content: z.string().min(3, { message: "Comment must be at least 3 characters" }),
  articleId: z.string(),
})


// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

// Profile schema
export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  expertise: z.string().max(200).optional(),
  website: z.string().url().optional().or(z.string().length(0)),
  twitter: z.string().max(50).optional(),
  linkedin: z.string().max(100).optional(),
  image: z.string().optional(),
})

// Password update schema
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

// Settings schemas
export const generalSettingsSchema = z.object({
  siteTitle: z.string().min(1, { message: "Site title is required" }),
  siteDescription: z.string().min(1, { message: "Site description is required" }),
  siteUrl: z.string().url({ message: "Please enter a valid URL" }),
  commentsEnabled: z.boolean().default(true),
})

export const appearanceSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  darkModeDefault: z.boolean().default(false),
})

export const emailSettingsSchema = z.object({
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  adminEmail: z.string().email({ message: "Please enter a valid email address" }),
  newCommentNotification: z.boolean().default(true),
  newUserNotification: z.boolean().default(true),
})



// Export types
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type SignInFormValues = z.infer<typeof signInSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type UserFormValues = z.infer<typeof userSchema>

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>
export type AppearanceSettingsValues = z.infer<typeof appearanceSettingsSchema>
export type EmailSettingsValues = z.infer<typeof emailSettingsSchema>

export type PostFormValues = z.infer<typeof postSchema>
export type CommentFormValues = z.infer<typeof commentSchema>
export type ContactFormValues = z.infer<typeof contactSchema>
export type NewsletterFormValues = z.infer<typeof newsletterSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>
