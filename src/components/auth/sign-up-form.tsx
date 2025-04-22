"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signUp } from "@/lib/actions/auth-actions"
import { Loader2, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { SignUpFormValues, signUpSchema } from "@/lib/validations"
import { CardContent } from "../ui/card"


export function SignUpForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)


  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    setIsLoading(true)

    try {
      const result = await signUp(values, 'ADMIN')

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Success",
        description: result.message,
      })
      setIsSubmitted(true)
      // router.push("/verify-email")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  if (isSubmitted) {
    return (
      <CardContent className="pt-6">
        <div className="text-center py-4">
          <div className="mx-auto h-12 w-12 bg-[#f8f8f8] rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-[#fc8a06]" />
          </div>
          <h3 className="text-lg font-medium mb-2">Verify your email</h3>
          <p className="text-[#8e8e8e] mb-6">
            We've sent a verification email to your inbox. Please check your email and click the verification link
            to activate your account.
          </p>
        </div>
      </CardContent>
    )
  }
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/" })}>
          Google
        </Button>
        <Button variant="outline" onClick={() => signIn("github", { callbackUrl: "/" })}>
          GitHub
        </Button>
      </div>
    </div>
  )
}
