"use client";

import { Plus, UserRoundIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/app/[locale]/actions";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  picture: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface Dialog12Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: ProfileFormValues) => void;
  defaultName?: string;
  defaultPicture?: string;
  title?: string;
  showTrigger?: boolean;
  hideAvatarUpload?: boolean; // New prop to hide avatar upload for anonymous users
}

export default function Dialog12({
  open = false,
  onOpenChange,
  onSave,
  defaultName = "",
  defaultPicture = "",
  title = "Update Profile",
  showTrigger = true,
  hideAvatarUpload = false
}: Dialog12Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: defaultName,
      picture: defaultPicture
    }
  });

  const watchedPicture = form.watch("picture");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Only image files are allowed");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      form.setValue("picture", data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(data);
      } else {
        const result = await updateUserProfile(data);
        if (result?.data?.success) {
          toast.success("Profile updated successfully!");
          onOpenChange?.(false);
        } else {
          toast.error("Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button>Update Profile</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg p-0 rounded-3xl gap-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="font-medium">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`grid grid-cols-1 px-6 pt-4 pb-6 ${hideAvatarUpload ? '' : 'md:grid-cols-5'}`}>
            {!hideAvatarUpload && (
              <div className="flex flex-col items-center justify-center md:col-span-2">
                <div className="relative mb-2">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={watchedPicture || undefined} alt="Profile" />
                    <AvatarFallback>
                      <UserRoundIcon
                        size={52}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-0.5 -right-0.5 bg-accent rounded-full border-[3px] border-background h-8 w-8 hover:bg-accent"
                    onClick={() => {
                      if (watchedPicture) {
                        form.setValue("picture", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      } else {
                        triggerFileInput();
                      }
                    }}
                  >
                    {watchedPicture ? (
                      <X className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {watchedPicture ? "Remove image" : "Upload image"}
                    </span>
                  </Button>
                </div>

                <p className="text-center font-medium">Upload Image</p>
                <p className="text-center text-sm text-muted-foreground">
                  Max file size: 2MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Add Image"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}

            <div className={`flex flex-col justify-between ${hideAvatarUpload ? '' : 'md:col-span-3'}`}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Name <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-foreground text-background hover:bg-foreground/90"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
