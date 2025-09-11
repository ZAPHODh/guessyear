"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HowToPlayContent } from "./how-to-play-content";

export default function HowToPlayModal() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useI18n();

    const isOpen = pathname.includes("/how-to-play");

    return (
        <Dialog open={isOpen} onOpenChange={() => router.back()}>
            <DialogContent className="w-full max-w-2xl max-h-[90vh] rounded-md md:mx-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="font-semibold tracking-tight transition-colors">
                            {t("howToPlay.title")}
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        <HowToPlayContent />
                        <div className="flex justify-center pt-4">
                            <Button onClick={() => router.back()}>
                                {t("howToPlay.readyToPlay")}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}