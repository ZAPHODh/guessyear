"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageEditForm } from "@/components/image-edit-form"

interface DailyImage {
  id: string
  cloudinaryUrl: string
  year: number
  description: string | null
  date: Date
  _count: {
    gameProgress: number
  }
}

interface ImageEditModalProps {
  image: DailyImage
}

export default function ImageEditModal({ image }: ImageEditModalProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.back()
  }

  const handleDelete = () => {
    router.back()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Update image details and schedule
          </DialogDescription>
        </DialogHeader>
        <ImageEditForm image={image} onSuccess={handleSuccess} onDelete={handleDelete} />
      </DialogContent>
    </Dialog>
  )
}