import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import { siteConfig } from "@/config/site";

export default async function TermsPage() {
  const scopedT = await getScopedI18n("terms");
  const locale = await getCurrentLocale();
  const config = siteConfig(locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          {scopedT("legal")}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">{scopedT("title")}</h1>
        <p className="text-muted-foreground text-lg">
          {scopedT("subtitle")}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {scopedT("lastUpdated")}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("acceptance.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("acceptance.content")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("gameRules.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>{scopedT("gameRules.rule1")}</li>
              <li>{scopedT("gameRules.rule2")}</li>
              <li>{scopedT("gameRules.rule3")}</li>
              <li>{scopedT("gameRules.rule4")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("userAccounts.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("userAccounts.content")}</p>
            <ul>
              <li>{scopedT("userAccounts.responsibility1")}</li>
              <li>{scopedT("userAccounts.responsibility2")}</li>
              <li>{scopedT("userAccounts.responsibility3")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("prohibited.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>{scopedT("prohibited.item1")}</li>
              <li>{scopedT("prohibited.item2")}</li>
              <li>{scopedT("prohibited.item3")}</li>
              <li>{scopedT("prohibited.item4")}</li>
              <li>{scopedT("prohibited.item5")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("content.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("content.ownership")}</p>
            <p>{scopedT("content.userContent")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("liability.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("liability.content")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("contact.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{scopedT("contact.content")}</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <a href={`mailto:${config.email}`} className="text-blue-600 hover:underline">
                  {config.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}