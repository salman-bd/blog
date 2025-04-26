"use client"

import { Suspense } from "react"
import { VerifyEmailContent } from "./verify-email-content"

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="container max-w-md flex items-center justify-center p-8">Loading...</div>}>
      <ClientVerifyPage />
    </Suspense>
  )
}

// This component is wrapped in Suspense and can safely use useSearchParams
function ClientVerifyPage() {
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const callbackUrl = searchParams.get("callbackUrl")

  // console.log("Token for verification: ", token)

  return <VerifyEmailContent token={token} callbackUrl={callbackUrl}/>
}
