"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Loader2, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getAllComments, deleteComment } from "@/lib/actions/comment-actions"
import { Pagination } from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "../ui/use-toast"

export function CommentsTab() {
  const { toast } = useToast()
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadComments(currentPage)
  }, [currentPage])

  async function loadComments(page: number) {
    try {
      setIsLoading(true)
      setError(null)

      const result = await getAllComments({ page, limit: 10 })

      if (result.success) {
        setComments(result.comments)
        setTotalPages(result.pagination.totalPages)
      } else {
        setError("Failed to load comments")
      }
    } catch (error) {
      console.error("Error loading comments:", error)
      setError("An error occurred while loading comments")
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (commentId: string) => {
    setCommentToDelete(commentId)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!commentToDelete) return

    try {
      setIsActionLoading(true)
      const result = await deleteComment(commentToDelete)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the deleted comment from the local state
        setComments(comments.filter((comment) => comment.id !== commentToDelete))
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
        description: "Failed to delete comment",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
      setIsDeleteDialogOpen(false)
      setCommentToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Comments</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No comments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comment</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{comment.content}</div>
                    </TableCell>
                    <TableCell>{comment.user.name}</TableCell>
                    <TableCell>
                      <Link href={`/blog/${comment.post.slug}`} className="hover:text-amber-600">
                        {comment.post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isActionLoading}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteDialog(comment.id)}
                            disabled={isActionLoading}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!isLoading && totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading}>
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
