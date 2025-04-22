"use server"

import { Resend } from "resend"
import { VerificationEmail } from "@/emails/verification-email"
import { ResetPasswordEmail } from "@/emails/reset-password-email"
import { WelcomeEmail } from "@/emails/welcome-email"
import { AdminNotificationEmail } from "@/emails/admin-notification-email"
import { SubscriptionConfirmationEmail } from "@/emails/subscription-confirmation-email"
import { ContactConfirmationEmail } from "@/emails/contact-confirmation-email"
import ContactReplyEmail from "@/emails/contact-reply-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <verification@cscsylhet.com>",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ verificationUrl }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send verification email:", error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <reset-password@cscsylhet.com>",
      to: email,
      subject: "Reset your password",
      react: ResetPasswordEmail({ resetUrl }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <welcome@cscsylhet.com>",
      to: email,
      subject: "Welcome to Junayed Ahmed's Blog",
      react: WelcomeEmail({ name }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    return { success: false, error }
  }
}

export async function sendContactConfirmationEmail(email: string, name: string, subject: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <contact-confirmation@cscsylhet.com>",
      to: email,
      subject: "We've received your message",
      react: ContactConfirmationEmail({ name, subject }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send contact confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendAdminNotificationEmail(name: string, email: string, subject: string, message: string) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@cscsylhet.com"

    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed Blog <admin-notification@cscsylhet.com>",
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      react: AdminNotificationEmail({ name, email, subject, message }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send admin notification email:", error)
    return { success: false, error }
  }
}

export async function sendSubscriptionConfirmationEmail(email: string) {
  try {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=placeholder-token`

    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <subscription-confirm@cscsylhet.com>",
      to: email,
      subject: "Welcome to Junayed Ahmed's Newsletter",
      react: SubscriptionConfirmationEmail({ email, unsubscribeUrl }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send subscription confirmation email:", error)
    return { success: false, error }
  }
}


export async function sendContactReplyEmail(email: string, name: string, userEmailSubject: string, userEmailMessage: string, subject: string, message: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Junayed Ahmed <contact-replay@cscsylhet.com>",
      to: email,
      subject: subject,
      react: ContactReplyEmail({ name, userEmailSubject, userEmailMessage, message }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send contact reply email:", error)
    return { success: false, error }
  }
}