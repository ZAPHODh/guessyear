'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "../mode-toggle";
import { ReactNode } from "react";
import { useScopedI18n } from "@/locales/client";
import { cn } from "@/lib/utils";

interface NavClientProps {
    locale: string;
    configName: string;
    children: ReactNode;
}

export default function NavClient({ locale, configName, children }: NavClientProps) {
    const pathname = usePathname();
    const maxWidth = pathname.includes('daily') ? 'max-w-2xl' : 'max-w-6xl';
    const headerT = useScopedI18n("header");

    const isActive = (path: string) => pathname.includes(path);

    return (
        <nav className="backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className={`container mx-auto px-4 ${maxWidth}`}>
                <div className="flex h-16 items-center justify-between">

                    <div className="flex-1 flex justify-start gap-4">
                        <Link
                            href={`/${locale}/daily`}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground",
                                isActive('/daily')
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {headerT("daily")}
                        </Link>
                        <Link
                            href={`/${locale}/lobby`}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground",
                                isActive('/lobby')
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {headerT("lobby")}
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <Link href={`/${locale}`} className="font-bold text-xl hover:opacity-80 transition-opacity">
                            {configName}
                        </Link>
                    </div>


                    <div className="flex-1 flex justify-end items-center gap-2">
                        <ModeToggle />
                        {children}
                    </div>
                </div>
            </div>
        </nav>
    )
}