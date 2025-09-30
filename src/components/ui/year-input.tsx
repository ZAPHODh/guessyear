"use client"

import { MinusIcon, PlusIcon, Send } from "lucide-react"
import { Button as AriaButton, Group, Input as AriaInput, Label, NumberField } from "react-aria-components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface YearInputProps {
  value: number | string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  className?: string
  showSubmitButton?: boolean
  submitButtonText?: string
  onKeyPress?: (e: React.KeyboardEvent) => void
}

export function YearInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter year",
  disabled = false,
  min = 1800,
  max = new Date().getFullYear(),
  className,
  showSubmitButton = false,
  submitButtonText = "Submit",
  onKeyPress
}: YearInputProps) {
  const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value

  const handleIncrement = () => {
    const newValue = Math.min(numericValue + 1, max)
    onChange(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(numericValue - 1, min)
    onChange(newValue.toString())
  }

  const handleInputChange = (val: number) => {
    onChange(val.toString())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onKeyPress) {
      onKeyPress(e)
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <NumberField
        value={numericValue}
        onChange={handleInputChange}
        minValue={min}
        maxValue={max}
        isDisabled={disabled}
        className="flex-1"
      >
        <Group className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:ring-[3px]">
          <AriaButton
            slot="decrement"
            onPress={handleDecrement}
            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MinusIcon size={16} aria-hidden="true" />
          </AriaButton>
          <AriaInput
            className="bg-background text-foreground w-full grow px-3 py-2 text-center tabular-nums text-lg"
            placeholder={placeholder}
            onKeyDown={handleKeyPress}
          />
          <AriaButton
            slot="increment"
            onPress={handleIncrement}
            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon size={16} aria-hidden="true" />
          </AriaButton>
        </Group>
      </NumberField>

      {showSubmitButton && onSubmit && (
        <Button
          onClick={onSubmit}
          disabled={!value || disabled}
          className="px-6"
        >
          <Send className="h-4 w-4 mr-2" />
          {submitButtonText}
        </Button>
      )}
    </div>
  )
}