import type { NextAuthOptions, User } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/sendEmail"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // remember: { label: "Remember", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email before signing in")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          isVerified: user.isVerified,
        } as User
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // Handle the remember me option
      if (credentials && "remember" in credentials) {
        // console.log('Remember: ', credentials.remember);
        
        if (!credentials.remember) {
          // If remember is false, set session to expire in 1 day instead of 30
          authOptions.cookies!.sessionToken!.options.maxAge = 24 * 60 * 60 // 1 day
        }
      }

      // Rest of your existing signIn callback
      // For OAuth providers
      if (account?.provider && ["google", "facebook"].includes(account.provider)) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          })

          // If user exists but doesn't have this provider linked
          if (existingUser) {
            // Check if this provider account already exists
            const existingAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId,
            )

            // Only create a new account if it doesn't exist
            if (!existingAccount) {
              // Check if there's already an account with this provider but different providerAccountId
              const existingProviderAccount = existingUser.accounts.find((acc) => acc.provider === account.provider)

              if (existingProviderAccount) {
                // Update the existing provider account
                await prisma.account.update({
                  where: {
                    id: existingProviderAccount.id,
                  },
                  data: {
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  },
                })
              } else {
                // Create a new account for this provider
                await prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  },
                })
              }
            }

            // Update user to be verified if they weren't already
            if (!existingUser.isVerified) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  isVerified: true,
                  emailVerified: new Date(),
                },
              })
            }

            return true
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For social logins, update the user with additional data
        if (["google", "facebook"].includes(account.provider)) {
          try {
            // Find the user that was just created by the adapter
            const prismaUser = await prisma.user.findUnique({
              where: { email: user.email! },
            })

            if (prismaUser) {
              // Update with additional fields
              const updatedUser = await prisma.user.update({
                where: { id: prismaUser.id },
                data: {
                  emailVerified: new Date(),
                  isVerified: true,
                  updatedAt: new Date(),
                },
              })

              // If this is a new user, send welcome email
              if (updatedUser.createdAt && new Date().getTime() - new Date(updatedUser.createdAt).getTime() < 60000) {
                // User was created less than a minute ago, likely new
                try {
                  await sendWelcomeEmail(user.email, user.name)
                } catch (emailError) {
                  console.error("Failed to send welcome email:", emailError)
                }
              }
              // Update token with user data
              token.id = updatedUser.id
              token.role = updatedUser.role
              token.isVerified = updatedUser.isVerified
            }
          } catch (error) {
            console.error("Error updating user in JWT callback:", error)
          }
        } else {
          // For credentials provider
          token.id = user.id
          token.role = user.role
          token.isVerified = user.isVerified
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
      }
      console.log("User session: ", session)

      return session
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days by default
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}
