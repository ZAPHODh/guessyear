"use client";

import { useI18n } from "@/locales/client";

interface HowToPlayContentProps {
  className?: string;
}

export function HowToPlayContent({ className = "" }: HowToPlayContentProps) {
  const t = useI18n();

  return (
    <div className={`space-y-6 ${className}`}>
      <p className="text-muted-foreground">{t("howToPlay.subtitle")}</p>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t("howToPlay.objective.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("howToPlay.objective.description")}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">{t("howToPlay.howItWorks.title")}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <p className="text-sm text-muted-foreground">{t("howToPlay.howItWorks.step1")}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <p className="text-sm text-muted-foreground">{t("howToPlay.howItWorks.step2")}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <p className="text-sm text-muted-foreground">{t("howToPlay.howItWorks.step3")}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <p className="text-sm text-muted-foreground">{t("howToPlay.howItWorks.step4")}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t("howToPlay.smartRange.title")}</h3>
          <p className="text-sm text-muted-foreground mb-3">{t("howToPlay.smartRange.description")}</p>
          <div className="bg-muted p-3 rounded text-xs">
            <p><strong>{t("howToPlay.smartRange.example.title")}:</strong></p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
              <li>{t("howToPlay.smartRange.example.step1")}</li>
              <li>{t("howToPlay.smartRange.example.step2")}</li>
              <li>{t("howToPlay.smartRange.example.step3")}</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t("howToPlay.tips.title")}</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm text-muted-foreground">{t("howToPlay.tips.tip1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm text-muted-foreground">{t("howToPlay.tips.tip2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm text-muted-foreground">{t("howToPlay.tips.tip3")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}