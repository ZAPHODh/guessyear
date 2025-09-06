import { getCurrentSession } from "@/lib/server/auth/session";
import { getScopedI18n } from "@/locales/server";
import HeaderWrapper from "./header-wrapper";

export default async function Header() {
    const { user } = await getCurrentSession();
    const scopedT = await getScopedI18n("header");
    const headerText = {
        daily: scopedT("daily"),
        lobby: scopedT("freelancers"),
        login: scopedT("login"),
        account: scopedT("account"),
        about: scopedT("about"),
        out: scopedT('out'),
        settings: scopedT('settings'),
        profile: scopedT('profile')
    };

    return <HeaderWrapper headerText={headerText} user={user} />;
}