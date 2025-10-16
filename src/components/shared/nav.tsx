import AuthButton from "./auth-button";
import { siteConfig } from "@/config/site";
import NavClient from "./nav-client";
import { getCurrentSession } from "@/lib/server/auth/session";
import { getCurrentLocale } from "@/locales/server";

export default async function Nav({ locale }: { locale: string }) {
    const config = siteConfig(locale);
    const { user } = await getCurrentSession();
    const currentLocale = await getCurrentLocale();

    return (
        <NavClient locale={locale} configName={config.name}>
            <AuthButton user={user} locale={currentLocale} />
        </NavClient>
    )
}
