"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Loader2, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSubscribers, deleteSubscriber } from "@/lib/actions/subscribe-actions"
import { Pagination } from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "../ui/use-toast"

export function SubscribersTab() {
  const { toast } = useToast()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    loadSubscribers(currentPage, filterStatus)
  }, [currentPage, filterStatus])

  async function loadSubscribers(page: number, status: string | null) {
    try {
      setIsLoading(true)
      setError(null)

      const options: any = { page, limit: 10 }
      if (status) {
        options.status = status
      }

      const result = await getSubscribers(options)

      if (result.success) {
        setSubscribers(result.subscribers)
        setTotalPages(result.pagination.totalPages)
      } else {
        setError(result.message || "Failed to load subscribers")
      }
    } catch (error) {
      console.error("Error loading subscribers:", error)
      setError("An error occurred while loading subscribers")
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (subscriberId: string) => {
    setSubscriberToDelete(subscriberId)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!subscriberToDelete) return

    try {
      setIsActionLoading(true)
      const result = await deleteSubscriber(subscriberToDelete)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the deleted subscriber from the local state
        setSubscribers(subscribers.filter((subscriber) => subscriber.id !== subscriberToDelete))
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
        description: "Failed to delete subscriber",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
      setIsDeleteDialogOpen(false)
      setSubscriberToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Subscribers</h2>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            onClick={() => setFilterStatus(null)}
            className={filterStatus === null ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            onClick={() => setFilterStatus("active")}
            className={filterStatus === "active" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "unsubscribed" ? "default" : "outline"}
            onClick={() => setFilterStatus("unsubscribed")}
            className={filterStatus === "unsubscribed" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Unsubscribed
          </Button>
        </div>
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
          ) : subscribers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No subscribers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={subscriber.status === "active" ? "default" : "outline"}
                        className={
                          subscriber.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400"
                            : ""
                        }
                      >
                        {subscriber.status === "active" ? "Active" : "Unsubscribed"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
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
                            onClick={() => openDeleteDialog(subscriber.id)}
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
              Are you sure you want to delete this subscriber? This action cannot be undone.
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
