import { LogOutIcon } from "lucide-react";
import { logout } from "@/app/[locale]/actions";
import { Button } from "../ui/button";
import { useScopedI18n } from "@/locales/client";

export default function LogoutButton({ className }: { className?: string }) {
    const scopedT = useScopedI18n('shared')
    return (
        <div className={className}>
            <Button
                type="submit"
                onClick={async () => {
                    await logout();
                }}
                variant="destructive"
            >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>{scopedT('logout')}</span>
            </Button>
        </div>
    );
}