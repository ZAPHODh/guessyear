"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, ClipboardCheck, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Icons from "./icons"

interface ShareDrawerProps {
  title: string
  description: string
  shareText: string
  url: string
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "sm" | "lg" | "icon" | "default"
  className?: string
  children?: React.ReactNode
}

export function ShareDrawer({
  title,
  description,
  shareText,
  url,
  buttonText = "Share",
  buttonVariant = "outline",
  buttonSize = "default",
  className,
  children
}: ShareDrawerProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    onCopy: () => toast("Link copied to clipboard!")
  })

  const getShareMessage = () => `${shareText}\n\n${url}`

  const handleShare = async (platform: string, action: () => void) => {
    setIsSharing(true)
    try {
      await action()
    } catch (error) {
      toast("Share failed. Please try again.")
    } finally {
      setTimeout(() => setIsSharing(false), 500)
    }
  }

  const handleTwitterShare = () => {
    const message = getShareMessage()
    handleShare('twitter', () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank')
    })
  }

  const handleWhatsAppShare = () => {
    const message = getShareMessage()
    handleShare('whatsapp', () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    })
  }

  const handleDiscordShare = () => {
    const message = getShareMessage()
    handleShare('discord', () => {
      copyToClipboard(message)
      toast("Message copied! Paste it in Discord.")
    })
  }

  const handleCopyLink = () => {
    handleShare('copy', () => {
      copyToClipboard(url)
    })
  }

  const trigger = children || (
    <Button
      className={className}
      variant={buttonVariant}
      size={buttonSize}
    >
      <Share2 className="" />
      {buttonText}
    </Button>
  )

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid grid-cols-4 gap-6 mb-6">
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                disabled={isSharing}
                aria-label="Share on Twitter"
                className="w-full"
              >
                {isSharing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Icons.twitter className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                disabled={isSharing}
                aria-label="Share on WhatsApp"
                className="w-full"
              >
                {isSharing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Icons.WhatsApp className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDiscordShare}
                disabled={isSharing}
                aria-label="Share message"
                className="w-full"
              >
                {isSharing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                disabled={isSharing}
                aria-label={isCopied ? "Copied" : "Copy link"}
                className="w-full"
              >
                {isSharing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : isCopied ? (
                  <ClipboardCheck className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}

              </Button>
            </div>
          </div>
          <div className="p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}