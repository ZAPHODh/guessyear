import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/auth/session";
import SettingsForm from "@/components/settings/settings-form";
import { getScopedI18n } from "@/locales/server";

export default async function SettingsPage() {
    const { user } = await getCurrentSession();
    const settingsT = await getScopedI18n("settings");

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{settingsT("title")}</h1>
                <p className="text-muted-foreground">
                    {settingsT("description")}
                </p>
            </div>
            <SettingsForm user={user} />
        </div>
    );
}