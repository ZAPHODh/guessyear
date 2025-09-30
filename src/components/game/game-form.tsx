"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { YearInput } from "@/components/ui/year-input"
import { useScopedI18n } from "@/locales/client"

type GuessForm = {
  year: string
}

interface GameFormProps {
  minYear: number
  maxYear: number
  confidence: number
  isSubmitting: boolean
  onSubmit: (year: number) => Promise<void>
  resetTrigger?: any // To trigger form reset from parent
}

export function GameForm({
  minYear,
  maxYear,
  confidence,
  isSubmitting,
  onSubmit,
  resetTrigger
}: GameFormProps) {
  const t = useScopedI18n("daily")

  const schema = useMemo(() => {
    return z.object({
      year: z
        .string()
        .nonempty(t("invalidYear"))
        .refine((val) => !isNaN(Number(val)), {
          message: t("invalidYear"),
        })
        .refine((val) => {
          const num = Number(val)
          return num >= minYear && num <= maxYear
        }, {
          message: t("validRange", { min: minYear, max: maxYear }),
        })
    })
  }, [minYear, maxYear, t])

  const form = useForm<GuessForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: ""
    },
    mode: "onChange"
  })

  const previousResetTrigger = useRef(resetTrigger)

  useEffect(() => {
    if (resetTrigger !== previousResetTrigger.current) {
      form.setValue("year", "", { shouldValidate: false })
      previousResetTrigger.current = resetTrigger
    }
  }, [resetTrigger, form])

  const handleSubmit = async (data: GuessForm) => {
    const year = Number(data.year)
    await onSubmit(year)
    form.reset({ year: "" })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel className="block text-lg font-medium text-center">
            {t("guessPrompt")}
          </FormLabel>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <YearInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("yearPlaceholder")}
                      disabled={isSubmitting}
                      min={minYear}
                      max={maxYear}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-center text-sm text-muted-foreground mt-2 space-y-1">
                    <div>{t("validRange", { min: minYear, max: maxYear })}</div>
                    {confidence > 0 && (
                      <div className="text-xs flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                          <span>{confidence}% {t("rangeNarrowed")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg font-semibold"
          disabled={isSubmitting || !form.watch("year")?.trim()}
        >
          {isSubmitting ? t("submitting") : t("submitGuess")}
        </Button>
      </form>
    </Form>
  )
}