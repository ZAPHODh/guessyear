"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import SettingsForm from "./settings-form";
import { User } from "@prisma/client";
import { useScopedI18n } from "@/locales/client";

export default function SettingsModal({ user }: { user: User }) {
    const router = useRouter();
    const pathname = usePathname();
    const t = useScopedI18n("settings");

    const isOpen = pathname.includes("/settings");

    return (
        <Dialog open={isOpen} onOpenChange={() => router.back()}>
            <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>
                <SettingsForm user={user} />
            </DialogContent>
        </Dialog>
    );
}