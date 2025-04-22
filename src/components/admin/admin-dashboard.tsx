"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsTab } from "@/components/admin/posts-tab"
import { CategoriesTab } from "@/components/admin/categories-tab"
import { CommentsTab } from "@/components/admin/comments-tab"
import { UsersTab } from "@/components/admin/users-tab"
import { SettingsTab } from "@/components/admin/settings-tab"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Users } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2 text-sm">
            <Link href="/admin/contacts">
              <Mail className="h-4 w-4" />
              <span>Contacts</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2 text-sm">
            <Link href="/admin/subscribers">
              <Users className="h-4 w-4" />
              <span>Subscribers</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex items-center justify-between gap-2 w-full">
            <TabsTrigger value="posts" className="text-xs sm:text-sm">
              Posts
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm">
              Categories
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs sm:text-sm">
              Comments
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts">
          <PostsTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
