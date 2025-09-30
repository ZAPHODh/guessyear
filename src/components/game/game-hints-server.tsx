import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getScopedI18n } from "@/locales/server"

interface GameHintsProps {
  attempts: number
  tip?: string
}

export async function GameHintsServer({ attempts, tip }: GameHintsProps) {
  const t = await getScopedI18n("daily")

  if (attempts < 3) {
    return null
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="tip">
        <AccordionTrigger className="text-left">
          {t("needHint")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {tip && (
              <div className="p-3 bg-muted/50 rounded-lg">
                {tip}
              </div>
            )}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div>• {t("tips.generalHint")}</div>
                <div>• {t("tips.contextualHint")}</div>
                <div>• {t("tips.strategicHint")}</div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}