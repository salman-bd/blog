"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { submitComment, getComments, type CommentFormValues } from "@/lib/actions/comment-actions"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { Comment } from "@/types/types"
import { useParams } from "next/navigation"

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(1000, { message: "Comment is too long" }),
})

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const params = useParams()
  const { slug } = params
  const callbackUrl = `/blog/${slug}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    async function loadComments() {
      try {
        setIsLoading(true)
        const result = await getComments(postId)
        if (result.success) {
          setComments(result.comments)
        } else {
          toast({
            title: "Error",
            description: "Failed to load comments",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to load comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [postId, toast])

  async function onSubmit(values: CommentFormValues) {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitComment(values, postId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        form.reset()

        // Add the new comment to the list
        if (result.comment) {
          const newComment: Comment = {
            id: result.comment.id,
            content: values.content,
            createdAt: new Date(),
            user: {
              id: session.user.id,
              name: session.user.name || "User",
              image: session.user.image,
            },
          }

          setComments([newComment, ...comments])
        } else {
          // Reload comments if we don't have the new comment data
          const refreshResult = await getComments(postId)
          if (refreshResult.success) {
            setComments(refreshResult.comments)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      <div className="mb-8">
        {session?.user ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Leave a comment..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Comment"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-md text-center">
            <p className="mb-2">You need to be logged in to comment.</p>
            <Link href={`/signin?callbackUrl=${callbackUrl}`} className="text-amber-600 hover:underline">
              Sign in
            </Link>
            {" or "}
            <Link href={`/signup?callbackUrl=${callbackUrl}`} className="text-amber-600 hover:underline">
              Create an account
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 pb-6 border-b">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.image || "/placeholder.svg"} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{comment.user.name}</h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-400">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-stone-600 dark:text-stone-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
