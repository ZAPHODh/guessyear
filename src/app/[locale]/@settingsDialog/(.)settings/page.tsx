import { redirect } from "next/navigation";
import SettingsModal from "@/components/settings/settings-modal";
import { getCurrentSession } from "@/lib/server/auth/session";

export default async function SettingsInterceptModal() {
    const { user } = await getCurrentSession();

    if (!user) {
        return redirect("/login");
    }

    return <SettingsModal user={user} />;
}