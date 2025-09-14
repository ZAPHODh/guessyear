"use client";
import { CheckIcon, LanguagesIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeLocale, useCurrentLocale, useScopedI18n } from "@/locales/client";
import { Button } from "../ui/button";
import { useLocales } from "@/hooks/use-locales";

interface LocaleTogglerProps {
  showIcon?: boolean;
  variant?: "ghost" | "default" | "destructive" | "outline" | "secondary" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  asChild?: boolean;
}

export default function LocaleToggler({
  showIcon = true,
  variant = "ghost",
  size = "sm",
  className = "w-9 px-0",
  asChild = false
}: LocaleTogglerProps) {
  const scopedT = useScopedI18n('shared')
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const currentLocale = useCurrentLocale();
  const locales = useLocales();
  const TriggerContent = () => (
    <>
      {showIcon && <LanguagesIcon className="h-5 w-5" />}
      {!showIcon && <span>{scopedT('changeLocale')}</span>}
      <span className="sr-only">{scopedT('changeLocale')}</span>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={asChild}>
        <Button variant={variant} size={size} className={className}>
          <TriggerContent />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => changeLocale(locale.value as typeof currentLocale)}
            disabled={locale.value === currentLocale}
          >
            <span>{locale.name}</span>
            {locale.value === currentLocale ? (
              <DropdownMenuShortcut>
                <CheckIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}