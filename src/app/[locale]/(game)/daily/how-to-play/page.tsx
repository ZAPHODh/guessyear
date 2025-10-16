import { getScopedI18n } from "@/locales/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HowToPlayContent } from "@/components/layout/how-to-play-content";

export default async function HowToPlayPage() {
  const t = await getScopedI18n("howToPlay");

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/daily">
          <Button variant={'ghost'} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to game
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        </div>

        <HowToPlayContent />

        <div className="text-center pt-6">
          <Link href="/daily">
            <Button size="lg">
              {t("readyToPlay")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}