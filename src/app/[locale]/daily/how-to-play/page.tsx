import { getScopedI18n } from "@/locales/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function HowToPlayPage() {
  const t = await getScopedI18n("howToPlay");

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/daily">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to game
          </Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t("objective.title")}</h2>
            <p>{t("objective.description")}</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t("howItWorks.title")}</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <p>{t("howItWorks.step1")}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <p>{t("howItWorks.step2")}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <p>{t("howItWorks.step3")}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</span>
                <p>{t("howItWorks.step4")}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t("smartRange.title")}</h2>
            <p className="mb-3">{t("smartRange.description")}</p>
            <div className="bg-muted p-3 rounded text-sm">
              <p><strong>{t("smartRange.example.title")}:</strong></p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li>{t("smartRange.example.step1")}</li>
                <li>{t("smartRange.example.step2")}</li>
                <li>{t("smartRange.example.step3")}</li>
              </ul>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t("tips.title")}</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t("tips.tip1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t("tips.tip2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t("tips.tip3")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link href="/daily">
            <Button size="lg">
              Ready to play!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}