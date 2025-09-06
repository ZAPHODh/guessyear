import { getCurrentSession } from "@/lib/server/auth/session";
import { getScopedI18n } from "@/locales/server";
import Navbar from "./navbar";

export default async function Header() {
    const { user } = await getCurrentSession();
    const scopedT = await getScopedI18n("header");
    const headerText = {
        daily: scopedT("projects"),
        lobby: scopedT("freelancers"),
        login: scopedT("login"),
        account: scopedT("account"),
        about: scopedT("about"),
        out: scopedT('out'),
        settings: scopedT('settings'),
        profile: scopedT('profile')
    };

    return (
        <header className="h-20 w-full">
            <div className="container h-full mx-auto px-4">
                <Navbar headerText={headerText} user={user} />
            </div>
        </header>
    );
}