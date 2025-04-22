"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"
import { useToast } from "../ui/use-toast"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { toast } = useToast()

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(shareLinks.facebook, "_blank")}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(shareLinks.twitter, "_blank")}
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(shareLinks.email, "_blank")}
      >
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share via Email</span>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full" onClick={copyToClipboard}>
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Copy Link</span>
      </Button>
    </div>
  )
}
