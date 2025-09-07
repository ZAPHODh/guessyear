"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { submitSupportMessage } from "@/app/[locale]/(support)/contact/actions";

const supportFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

interface SupportContactFormProps {
  defaultName?: string;
  defaultEmail?: string;
}

export default function SupportContactForm({
  defaultName = "",
  defaultEmail = ""
}: SupportContactFormProps) {
  const t = useScopedI18n('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportFormData>({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: SupportFormData) {
    setIsSubmitting(true);

    try {
      const validatedData = supportFormSchema.parse(data);
      const result = await submitSupportMessage(validatedData);

      if (result?.data?.success) {
        toast.success(t('successTitle'), {
          description: t('successDescription'),
        });
        form.reset({
          name: defaultName,
          email: defaultEmail,
          subject: "",
          message: "",
        });
      } else {
        const errorMessage = typeof result?.serverError === 'string'
          ? result.serverError
          : result?.serverError?.message || t('sendFailure');
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstIssue = error.issues[0];
        toast.error(t('validationErrorTitle'), {
          description: firstIssue?.message || t('validationErrorDescription'),
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : t('genericError');
        toast.error(t('errorTitle'), {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: t('nameRequired'),
              maxLength: { value: 100, message: t('nameTooLong') }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('namePlaceholder')}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: t('emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('emailInvalid')
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          rules={{
            required: t('subjectRequired'),
            maxLength: { value: 200, message: t('subjectTooLong') }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('subject')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('subjectPlaceholder')}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          rules={{
            required: t('messageRequired'),
            minLength: { value: 10, message: t('messageMinLength') },
            maxLength: { value: 2000, message: t('messageTooLong') }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('messagePlaceholder')}
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t('send')}
        </Button>
      </form>
    </Form>
  );
}