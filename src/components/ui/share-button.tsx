"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Download, Twitter, MessageCircle, Copy, Facebook, ClipboardCheck, LoaderCircle } from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import { useCurrentLocale } from "@/locales/client"
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
import Icons from "../shared/icons"

interface ShareButtonProps {
  attempts: number
  won: boolean
  correctYear: number
  className?: string
}

export function ShareButton({ attempts, won, correctYear, className }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const t = useScopedI18n("daily.share")
  const locale = useCurrentLocale()
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    onCopy: () => toast(t("copySuccess"))
  })

  const shareText = won
    ? t("shareText.won", { attempts, plural: attempts === 1 ? '' : 's' })
    : t("shareText.lost", { correctYear })

  const gameUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const getShareMessage = () => `${shareText}\n\n${t("shareText.playAt")} ${gameUrl}`

  const generateShareImage = async () => {
    if (shareUrl) return shareUrl

    setIsGenerating(true)
    try {
      const params = new URLSearchParams({
        locale,
        attempts: attempts.toString(),
        won: won.toString(),
        correctYear: correctYear.toString(),
      })

      const imageUrl = `/api/share?${params.toString()}`
      const response = await fetch(imageUrl)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        setShareUrl(url)
        return url
      }
    } catch (error) {
      console.error("Failed to generate image:", error)
    } finally {
      setIsGenerating(false)
    }
    return ""
  }

  const handleTwitterShare = () => {
    const message = getShareMessage()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleWhatsAppShare = () => {
    const message = getShareMessage()
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')
  }

  const handleCopyLink = () => {
    const message = getShareMessage()
    copyToClipboard(message)
  }

  const handleDownloadImage = async () => {
    const url = await generateShareImage()
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = `daily-challenge-${won ? 'win' : 'attempt'}-${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleNativeShare = async () => {
    const url = await generateShareImage()
    if (navigator.share && url) {
      try {
        const response = await fetch(url)
        const blob = await response.blob()
        const file = new File([blob], 'daily-challenge.png', { type: 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Daily Photo Challenge",
            text: shareText,
            files: [file]
          })
          return
        }
      } catch (shareError) {
        console.log("Native share failed")
      }
    }
    handleCopyLink()
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={className}
          variant="outline"
          size="lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {t("button")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerDescription>
              {shareText}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid grid-cols-4 gap-6 mb-6">
              <Button
                variant={'outline'}
                onClick={handleTwitterShare}
                disabled={isGenerating}
                aria-label={t("platforms.twitter")}
              >
                <Twitter className="h-6 w-6" />
              </Button>
              <Button
                variant={'outline'}
                onClick={handleWhatsAppShare}
                disabled={isGenerating}
                aria-label={t("platforms.whatsapp")}
              >
                <Icons.WhatsApp className="h-6 w-6" />
              </Button>
              <Button
                variant={'outline'}
                onClick={handleFacebookShare}
                disabled={isGenerating}
                aria-label={t("platforms.facebook")}
              >
                <Facebook className="h-6 w-6" />
              </Button>
              <Button
                variant={'outline'}
                onClick={handleCopyLink}
                disabled={isGenerating}
                aria-label={isCopied ? t("copied") : t("copy")}
              >
                {isCopied ? (
                  <ClipboardCheck className="h-6 w-6" />
                ) : (
                  <Copy className="h-6 w-6" />
                )}
              </Button>
            </div>
            <div className="">
              <Button
                onClick={handleDownloadImage}
                // disabled={isGenerating}
                disabled={true}
                className="w-full justify-center"
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle className="h-5 w-5  rounded-full animate-spin" />
                    <span className="text-sm font-medium">{t("generating")}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span className="text-sm font-medium">{t("download")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                {t("cancel")}
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}