"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Loader2, Mail, Archive, Trash2, Eye, Reply } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  getContacts,
  updateContactStatus,
  deleteContact,
  replyToContact,
  type ReplyFormValues,
} from "@/lib/actions/contact-actions"

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "READ" | "UNREAD" | "ARCHIVED"
  createdAt: string
  replied: boolean
  repliedAt: string | null
}

const replySchema = z.object({
  contactId: z.string(),
  replyMessage: z.string().min(10, { message: "Reply must be at least 10 characters" }),
})

export function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      contactId: "",
      replyMessage: "",
    },
  })

  useEffect(() => {
    async function loadContacts() {
      try {
        const result = await getContacts()
        if (result.success) {
          setContacts(result.contacts as Contact[])
          setFilteredContacts(result.contacts as Contact[])
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading contacts:", error)
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [toast])

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredContacts(contacts)
    } else if (activeTab === "unread") {
      setFilteredContacts(contacts.filter((contact) => contact.status === "UNREAD"))
    } else if (activeTab === "read") {
      setFilteredContacts(contacts.filter((contact) => contact.status === "READ"))
    } else if (activeTab === "archived") {
      setFilteredContacts(contacts.filter((contact) => contact.status === "ARCHIVED"))
    }
  }, [activeTab, contacts])

  async function handleStatusChange(id: string, status: "READ" | "UNREAD" | "ARCHIVED") {
    try {
      const result = await updateContactStatus(id, status)
      if (result.success) {
        setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, status } : contact)))
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      })
    }
  }

  async function handleDelete() {
    if (!contactToDelete) return

    try {
      setIsSubmitting(true)
      const result = await deleteContact(contactToDelete)
      if (result.success) {
        setContacts((prev) => prev.filter((contact) => contact.id !== contactToDelete))
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  async function onReplySubmit(values: ReplyFormValues) {
    try {
      setIsSubmitting(true)
      const result = await replyToContact(values)
      if (result.success) {
        // Update the contact in the list
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === values.contactId
              ? { ...contact, status: "READ", replied: true, repliedAt: new Date().toISOString() }
              : contact,
          ),
        )
        toast({
          title: "Success",
          description: result.message,
        })
        form.reset()
        setIsReplyDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error replying to contact:", error)
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function openReplyDialog(contact: Contact) {
    setSelectedContact(contact)
    form.setValue("contactId", contact.id)
    form.setValue("replyMessage", "")
    setIsReplyDialogOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Manage messages from your contact form</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-6 text-stone-500">No messages found</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                contact.status === "UNREAD"
                                  ? "default"
                                  : contact.status === "READ"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {contact.status.toLowerCase()}
                              {contact.replied && " (replied)"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedContact(contact)
                                    setIsViewOpen(true)
                                    if (contact.status === "UNREAD") {
                                      handleStatusChange(contact.id, "READ")
                                    }
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openReplyDialog(contact)}>
                                  <Reply className="mr-2 h-4 w-4" />
                                  Reply
                                </DropdownMenuItem>
                                {contact.status !== "READ" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "READ")}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                {contact.status !== "UNREAD" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "UNREAD")}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark as Unread
                                  </DropdownMenuItem>
                                )}
                                {contact.status !== "ARCHIVED" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "ARCHIVED")}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setContactToDelete(contact.id)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Contact Sheet */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Contact Message</SheetTitle>
            <SheetDescription>View message details</SheetDescription>
          </SheetHeader>
          {selectedContact && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-500">From</h3>
                <p>
                  {selectedContact.name} ({selectedContact.email})
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-500">Subject</h3>
                <p>{selectedContact.subject}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-500">Message</h3>
                <p className="whitespace-pre-line">{selectedContact.message}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-500">Received</h3>
                <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>
              {selectedContact.replied && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-stone-500">Replied</h3>
                  <p>{selectedContact.repliedAt ? new Date(selectedContact.repliedAt).toLocaleString() : "Yes"}</p>
                </div>
              )}
              <div className="pt-4 flex gap-2">
                <Button onClick={() => openReplyDialog(selectedContact)} className="bg-amber-600 hover:bg-amber-700">
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setContactToDelete(selectedContact.id)
                    setIsDeleteDialogOpen(true)
                    setIsViewOpen(false)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
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

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Contact</DialogTitle>
            <DialogDescription>Send a reply to {selectedContact?.name}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onReplySubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="replyMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reply</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your reply here..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                  {isSubmitting ? (
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
    </>
  )
}
