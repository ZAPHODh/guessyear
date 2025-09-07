"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadForm } from "@/components/forms/image-upload-form"

export default function ImageUploadModal() {
  const router = useRouter()

  const handleSuccess = () => {
    router.back()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Image</DialogTitle>
          <DialogDescription>
            Add a new image to the daily collection
          </DialogDescription>
        </DialogHeader>
        <ImageUploadForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}