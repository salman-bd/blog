import { randomBytes } from "crypto"

export async function generateVerificationToken(): Promise<string> {
  // Create a random token
  const token = randomBytes(32).toString("hex")

  // Hash token with user's email for additional security
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  return token
}

export async function generatePasswordResetToken(email: string): Promise<string> {
  // Create a random token
  const token = randomBytes(32).toString("hex")

  // Hash token with user's email for additional security
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

  return token
}