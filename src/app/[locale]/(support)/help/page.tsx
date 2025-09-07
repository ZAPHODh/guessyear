import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import Link from "next/link";

export default async function HelpPage() {
  const scopedT = await getScopedI18n("help");

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          {scopedT("support")}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">{scopedT("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {scopedT("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>{scopedT("quickStart.title")}</CardTitle>
            <CardDescription>{scopedT("quickStart.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/how-to-play">
                {scopedT("quickStart.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>{scopedT("community.title")}</CardTitle>
            <CardDescription>{scopedT("community.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/lobby">
                {scopedT("community.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>{scopedT("contactUs.title")}</CardTitle>
            <CardDescription>{scopedT("contactUs.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contact">
                {scopedT("contactUs.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {scopedT("faq.title")}
          </CardTitle>
          <CardDescription>
            {scopedT("faq.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how-to-play">
              <AccordionTrigger className="text-left">
                {scopedT("faq.howToPlay.question")}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>{scopedT("faq.howToPlay.answer")}</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>{scopedT("faq.howToPlay.step1")}</li>
                    <li>{scopedT("faq.howToPlay.step2")}</li>
                    <li>{scopedT("faq.howToPlay.step3")}</li>
                    <li>{scopedT("faq.howToPlay.step4")}</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scoring">
              <AccordionTrigger className="text-left">
                {scopedT("faq.scoring.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.scoring.answer")}</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>{scopedT("faq.scoring.correct")}</li>
                  <li>{scopedT("faq.scoring.time")}</li>
                  <li>{scopedT("faq.scoring.streak")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="categories">
              <AccordionTrigger className="text-left">
                {scopedT("faq.categories.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.categories.answer")}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary">{scopedT("faq.categories.geography")}</Badge>
                  <Badge variant="secondary">{scopedT("faq.categories.food")}</Badge>
                  <Badge variant="secondary">{scopedT("faq.categories.landmarks")}</Badge>
                  <Badge variant="secondary">{scopedT("faq.categories.animals")}</Badge>
                  <Badge variant="secondary">{scopedT("faq.categories.objects")}</Badge>
                  <Badge variant="secondary">{scopedT("faq.categories.celebrities")}</Badge>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="daily-challenge">
              <AccordionTrigger className="text-left">
                {scopedT("faq.daily.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.daily.answer")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="leaderboard">
              <AccordionTrigger className="text-left">
                {scopedT("faq.leaderboard.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.leaderboard.answer")}</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>{scopedT("faq.leaderboard.daily")}</li>
                  <li>{scopedT("faq.leaderboard.weekly")}</li>
                  <li>{scopedT("faq.leaderboard.allTime")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account">
              <AccordionTrigger className="text-left">
                {scopedT("faq.account.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.account.answer")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="technical">
              <AccordionTrigger className="text-left">
                {scopedT("faq.technical.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.technical.answer")}</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>{scopedT("faq.technical.browser")}</li>
                  <li>{scopedT("faq.technical.cache")}</li>
                  <li>{scopedT("faq.technical.connection")}</li>
                  <li>{scopedT("faq.technical.contact")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multiplayer">
              <AccordionTrigger className="text-left">
                {scopedT("faq.multiplayer.question")}
              </AccordionTrigger>
              <AccordionContent>
                <p>{scopedT("faq.multiplayer.answer")}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {scopedT("stillNeedHelp")}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">
              {scopedT("contactSupport")}
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}