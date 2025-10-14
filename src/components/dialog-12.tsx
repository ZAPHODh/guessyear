"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

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
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: ProfileFormValues) => Promise<void>;
  defaultName?: string;
  title?: string;
  showTrigger?: boolean;
  isSubmitting?: boolean;
}

export default function ProfileDialog({
  open = false,
  onOpenChange,
  onSave,
  defaultName = "",
  title,
  showTrigger = true,
  isSubmitting: externalIsSubmitting = false
}: ProfileDialogProps) {
  const t = useScopedI18n('profileDialog');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: defaultName,
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (onSave) {
        await onSave(data);
      } else {
        const result = await updateUserProfile(data);
        if (result?.data?.success) {
          toast.success(t('successMessage'));
          onOpenChange?.(false);
        } else {
          toast.error(t('errorMessage'));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t('errorMessage'));
    }
  };

  const isSubmitting = form.formState.isSubmitting || externalIsSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button>{t('triggerButton')}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md rounded-3xl gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="font-medium">{title || t('title')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      {t('nameLabel')}
                      <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('namePlaceholder')}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isSubmitting}
              >
                {t('cancelButton')}
              </Button>
              <Button
                type="submit"
                className="bg-foreground text-background hover:bg-foreground/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('savingButton') : t('saveButton')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
