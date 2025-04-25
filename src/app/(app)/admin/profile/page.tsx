import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Mail, User } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Blogger",
  description: "View and manage your profile information",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  const userInitials = user?.name
    ? user?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="container py-12 max-w-4xl mx-auto px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-amber-600">My</span> Profile
      </h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <CardDescription>{user?.role}</CardDescription>
            </div>
            {/* <Button variant="outline" size="sm" className="ml-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button> */}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account created on {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {user?.role === "ADMIN" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>My Articles</CardTitle>
                <CardDescription>Manage your blog articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="admin/my-articles">View My Articles</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Access the admin dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
