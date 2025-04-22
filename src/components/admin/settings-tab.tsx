"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSettings, saveGeneralSettings, saveAppearanceSettings, saveEmailSettings, } from "@/lib/actions/settings-actions"
import { defaultSettings } from "@/lib/settings"
import { AppearanceSettingsValues, EmailSettingsValues, GeneralSettingsValues } from "@/lib/validations"
import { useToast } from "../ui/use-toast"

export function SettingsTab() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize forms
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(
      z.object({
        siteTitle: z.string().min(1, { message: "Site title is required" }),
        siteDescription: z.string().min(1, { message: "Site description is required" }),
        siteUrl: z.string().url({ message: "Please enter a valid URL" }),
        commentsEnabled: z.boolean().default(true),
      }),
    ),
    defaultValues: defaultSettings.general,
  })

  const appearanceForm = useForm<AppearanceSettingsValues>({
    resolver: zodResolver(
      z.object({
        primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          message: "Please enter a valid hex color code",
        }),
        secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          message: "Please enter a valid hex color code",
        }),
        darkModeDefault: z.boolean().default(false),
      }),
    ),
    defaultValues: defaultSettings.appearance,
  })

  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(
      z.object({
        fromEmail: z.string().email({ message: "Please enter a valid email address" }),
        adminEmail: z.string().email({ message: "Please enter a valid email address" }),
        newCommentNotification: z.boolean().default(true),
        newUserNotification: z.boolean().default(true),
      }),
    ),
    defaultValues: defaultSettings.email,
  })

  // Load settings on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true)
        setError(null)

        const result = await getSettings()

        if (result.success) {
          // Update form values with fetched settings
          generalForm.reset(result.settings.general)
          appearanceForm.reset(result.settings.appearance)
          emailForm.reset(result.settings.email)
        } else {
          setError(result.message || "Failed to load settings")
          // Use default settings as fallback
          generalForm.reset(defaultSettings.general)
          appearanceForm.reset(defaultSettings.appearance)
          emailForm.reset(defaultSettings.email)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        setError("Failed to load settings. Using default values.")

        // Use default settings as fallback
        generalForm.reset(defaultSettings.general)
        appearanceForm.reset(defaultSettings.appearance)
        emailForm.reset(defaultSettings.email)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [generalForm, appearanceForm, emailForm])

  // Save general settings
  const handleSaveGeneralSettings = async (values: GeneralSettingsValues) => {
    try {
      setIsSaving(true)
      const result = await saveGeneralSettings(values)

      if (result.success) {
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
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save appearance settings
  const handleSaveAppearanceSettings = async (values: AppearanceSettingsValues) => {
    try {
      setIsSaving(true)
      const result = await saveAppearanceSettings(values)

      if (result.success) {
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
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save email settings
  const handleSaveEmailSettings = async (values: EmailSettingsValues) => {
    try {
      setIsSaving(true)
      const result = await saveEmailSettings(values)

      if (result.success) {
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
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your blog's general settings</CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(handleSaveGeneralSettings)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your blog that appears in the browser tab and SEO.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>A brief description of your blog for SEO and social sharing.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The full URL of your blog (e.g., https://junayedahmed.com).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="commentsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Comments</FormLabel>
                          <FormDescription>Allow visitors to comment on your blog posts.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your blog</CardDescription>
            </CardHeader>
            <Form {...appearanceForm}>
              <form onSubmit={appearanceForm.handleSubmit(handleSaveAppearanceSettings)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={appearanceForm.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: field.value }} />
                        </div>
                        <FormDescription>
                          The main color used for buttons, links, and accents (hex code).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appearanceForm.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: field.value }} />
                        </div>
                        <FormDescription>The secondary color used throughout the site (hex code).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appearanceForm.control}
                    name="darkModeDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Dark Mode Default</FormLabel>
                          <FormDescription>Use dark mode as the default theme for your blog.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notifications and templates</CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleSaveEmailSettings)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The email address that will be used as the sender for all outgoing emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The email address where admin notifications will be sent.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="newCommentNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Comment Notifications</FormLabel>
                          <FormDescription>Receive an email when someone comments on your blog.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="newUserNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New User Notifications</FormLabel>
                          <FormDescription>Receive an email when a new user registers on your blog.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
