"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { verifyEmail } from "@/lib/actions/auth-actions"

interface VerifyEmailContentProps {
  token: string | null
  callbackUrl: string
}

export function VerifyEmailContent({ token, callbackUrl }: VerifyEmailContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError("Invalid verification token")
        setIsLoading(false)
        return
      }

      try {
        const result = await verifyEmail(token)

        if (!result.success) {
          setError(result.message)
          return
        }
        setIsVerified(true)
      } catch (error) {
        console.error("Verification error:", error)
        setError("Failed to verify email. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    verify()
  }, [token])

  if (isLoading) {
    return (
      <div className="container max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Verifying your email</CardTitle>
            <CardDescription>Please wait while we verify your email address.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
            <Loader2 className="h-16 w-16 animate-spin text-amber-600" />
            <p className="text-center text-sm text-muted-foreground">This may take a moment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Verification Failed</CardTitle>
            <CardDescription>We couldn't verify your email address.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="rounded-full bg-red-100 p-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-center text-sm text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/signin">
              <Button className="bg-amber-600 hover:bg-amber-700">Back to Sign In</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="container max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Email Verified</CardTitle>
            <CardDescription>Your email address has been successfully verified.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Thank you for verifying your email address. You can now sign in to your account.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={`/signin?callbackUrl=${callbackUrl}`}>
              <Button className="bg-amber-600 hover:bg-amber-700">Sign In</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return null
}
