"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Eye, Loader2, AlertCircle, Reply } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { getContacts, markContactAsRead, deleteContact, replyToContact } from "@/lib/actions/contact-actions"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const replyFormSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type ReplyFormValues = z.infer<typeof replyFormSchema>

export function ContactsTab() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [currentContact, setCurrentContact] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isReplying, setIsReplying] = useState(false)

  const replyForm = useForm<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  })

  useEffect(() => {
    loadContacts(currentPage, filterStatus)
  }, [currentPage, filterStatus])

  async function loadContacts(page: number, status: string | null) {
    try {
      setIsLoading(true)
      setError(null)

      const options: any = { page, limit: 10 }
      if (status) {
        options.status = status
      }

      const result = await getContacts(options)

      if (result.success) {
        setContacts(result.contacts)
        setTotalPages(result.pagination.totalPages)
      } else {
        setError(result.message || "Failed to load contacts")
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
      setError("An error occurred while loading contacts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewContact = async (contact: any) => {
    setCurrentContact(contact)
    setIsViewSheetOpen(true)

    // If contact is unread, mark it as read
    if (contact.status === "unread") {
      try {
        const result = await markContactAsRead(contact.id)

        if (result.success) {
          // Update the contact status in the local state
          setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, status: "read" } : c)))
        }
      } catch (error) {
        console.error("Error marking contact as read:", error)
      }
    }
  }

  const openDeleteDialog = (contactId: string) => {
    setContactToDelete(contactId)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!contactToDelete) return

    try {
      setIsActionLoading(true)
      const result = await deleteContact(contactToDelete)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the deleted contact from the local state
        setContacts(contacts.filter((contact) => contact.id !== contactToDelete))
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
        description: "Failed to delete contact",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
      setIsDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  const handleOpenReplyDialog = (contact: any) => {
    setCurrentContact(contact)
    replyForm.setValue("subject", `${contact.subject}`)
    setIsReplyDialogOpen(true)
  }

  const handleReply = async (values: ReplyFormValues) => {
    if (!currentContact) return

    try {
      setIsReplying(true)
      const result = await replyToContact(currentContact.id, values)

      if (result.success) {
        toast({
          title: "Success",
          description: "Reply sent successfully",
        })
        setIsReplyDialogOpen(false)
        replyForm.reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send reply",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Contacts</h2>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            onClick={() => setFilterStatus(null)}
            className={filterStatus === null ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "unread" ? "default" : "outline"}
            onClick={() => setFilterStatus("unread")}
            className={filterStatus === "unread" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Unread
          </Button>
          <Button
            variant={filterStatus === "read" ? "default" : "outline"}
            onClick={() => setFilterStatus("read")}
            className={filterStatus === "read" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Read
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
        <CardContent className="p-0 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className={contact.status === "unread" ? "font-medium" : ""}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{contact.email}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">{contact.subject}</div>
                      </TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={contact.status === "unread" ? "default" : "outline"}
                          className={
                            contact.status === "unread"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-400"
                              : ""
                          }
                        >
                          {contact.status === "unread" ? "Unread" : "Read"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isActionLoading}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenReplyDialog(contact)}>
                              <Reply className="mr-2 h-4 w-4" /> Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteDialog(contact.id)}
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
            </div>
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
              Are you sure you want to delete this contact? This action cannot be undone.
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

      {/* View Contact Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Contact Message</SheetTitle>
            <SheetDescription>Received on {currentContact && formatDate(currentContact.createdAt)}</SheetDescription>
          </SheetHeader>
          {currentContact && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <p className="mt-1">
                  {currentContact.name} ({currentContact.email})
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1">{currentContact.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="mt-1 whitespace-pre-wrap bg-muted p-4 rounded-md">{currentContact.message}</div>
              </div>
              <SheetFooter className="pt-4 flex gap-2">
                <Button variant="outline" onClick={() => setIsViewSheetOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewSheetOpen(false)
                    handleOpenReplyDialog(currentContact)
                  }}
                >
                  <Reply className="mr-2 h-4 w-4" /> Reply
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewSheetOpen(false)
                    openDeleteDialog(currentContact.id)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Contact</DialogTitle>
            <DialogDescription>
              Send a reply to {currentContact?.name} ({currentContact?.email})
            </DialogDescription>
          </DialogHeader>

          <Form {...replyForm}>
            <form onSubmit={replyForm.handleSubmit(handleReply)} className="space-y-4">
              <FormField
                control={replyForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={replyForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} placeholder="Type your reply here..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReplyDialogOpen(false)}
                  disabled={isReplying}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isReplying}>
                  {isReplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
