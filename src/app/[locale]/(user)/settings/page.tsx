import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/auth/session";
import SettingsForm from "@/components/settings/settings-form";

export default async function SettingsPage() {
    const { user } = await getCurrentSession();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>
            <SettingsForm user={user} />
        </div>
    );
}