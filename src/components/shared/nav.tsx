
import AuthButton from "./auth-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { Suspense } from "react";
import NavClient from "./nav-client";

export default function Nav({ locale }: { locale: string }) {
    const config = siteConfig(locale);

    return (
        <NavClient locale={locale} configName={config.name}>
            <Suspense fallback={<Skeleton className="h-9 w-9 rounded-md" />}>
                <AuthButton />
            </Suspense>
        </NavClient>
    )
}