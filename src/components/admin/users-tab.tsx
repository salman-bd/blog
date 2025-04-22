"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Edit, MoreHorizontal, Search, Trash, UserPlus, Loader2, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDebouncedCallback } from "use-debounce"
import { getUsers, createUser, updateUser, deleteUser, } from "@/lib/actions/user-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormValues } from "@/lib/validations"
import { useToast } from "../ui/use-toast"

export function UsersTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
        role: z.enum(["user", "admin"]),
      }),
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  })

  // Load users on component mount
  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        setError(null)

        const result = await getUsers()

        if (result.success) {
          setUsers(result.users || [])
          setFilteredUsers(result.users || [])
        } else {
          setError(result.message || "Failed to load users")
        }
      } catch (error) {
        console.error("Error loading users:", error)
        setError("Failed to load users. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(async (value) => {
    if (!value.trim()) {
      // If search is empty, reset to all users
      setFilteredUsers(users)
      return
    }

    try {
      // Search users from the server
      const result = await getUsers({ search: value })

      if (result.success) {
        setFilteredUsers(result.users || [])
      } else {
        // If server search fails, fall back to client-side filtering
        const searchTerm = value.toLowerCase()
        const results = users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm),
        )
        setFilteredUsers(results)
      }
    } catch (error) {
      console.error("Error searching users:", error)

      // Fall back to client-side filtering
      const searchTerm = value.toLowerCase()
      const results = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm),
      )
      setFilteredUsers(results)
    }
  }, 300)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Open dialog to create a new user
  const handleNewUser = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "user",
    })
    setIsEditMode(false)
    setCurrentUserId(null)
    setIsUserDialogOpen(true)
  }

  // Open dialog to edit an existing user
  const handleEditUser = (user: any) => {
    form.reset({
      name: user.name,
      email: user.email,
      password: "", // Don't set password when editing
      role: user.role,
    })
    setIsEditMode(true)
    setCurrentUserId(user.id)
    setIsUserDialogOpen(true)
  }

  // Open dialog to confirm user deletion
  const handleDeleteClick = (userId: string) => {
    setCurrentUserId(userId)
    setIsDeleteDialogOpen(true)
  }

  // Delete a user
  const handleDeleteUser = async () => {
    if (!currentUserId) return

    try {
      setIsSubmitting(true)
      const result = await deleteUser(currentUserId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Remove the deleted user from state
        setUsers(users.filter((user) => user.id !== currentUserId))
        setFilteredUsers(filteredUsers.filter((user) => user.id !== currentUserId))
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
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setCurrentUserId(null)
    }
  }

  // Submit form to create or update a user
  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true)

      let result
      if (isEditMode && currentUserId) {
        // Update existing user
        result = await updateUser(currentUserId, values)
      } else {
        // Create new user
        result = await createUser(values)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh users data
        const usersResult = await getUsers()
        if (usersResult.success) {
          setUsers(usersResult.users || [])
          setFilteredUsers(usersResult.users || [])
        }

        // Close dialog
        setIsUserDialogOpen(false)
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
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleNewUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredUsers.length} {filteredUsers.length === 1 ? "result" : "results"} for "{searchQuery}"
        </div>
      )}

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
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "outline"}
                        className={
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-400"
                            : ""
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(user.id)}>
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

      {/* User Form Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the user's information." : "Fill in the details to create a new user."}
            </DialogDescription>
          </DialogHeader>

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
                      <Input placeholder="john@example.com" type="email" {...field} />
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
                    <FormLabel>{isEditMode ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    {isEditMode && <FormDescription>Leave blank to keep the current password.</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUserDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
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
    </div>
  )
}
