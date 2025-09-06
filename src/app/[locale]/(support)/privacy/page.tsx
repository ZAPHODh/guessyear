import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import { siteConfig } from "@/config/site";

export default async function PrivacyPage() {
  const scopedT = await getScopedI18n("privacy");
  const locale = await getCurrentLocale();
  const config = siteConfig(locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          {scopedT("privacy")}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">{scopedT("title")}</h1>
        <p className="text-muted-foreground text-lg">
          {scopedT("subtitle")}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {scopedT("lastUpdated")}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      <Alert className="mb-8">
        <AlertDescription>
          {scopedT("commitment")}
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("dataCollection.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("dataCollection.intro")}</p>
            <h4>{scopedT("dataCollection.personalInfo")}</h4>
            <ul>
              <li>{scopedT("dataCollection.email")}</li>
              <li>{scopedT("dataCollection.username")}</li>
              <li>{scopedT("dataCollection.profilePicture")}</li>
              <li>{scopedT("dataCollection.preferences")}</li>
            </ul>
            <h4>{scopedT("dataCollection.gameData")}</h4>
            <ul>
              <li>{scopedT("dataCollection.scores")}</li>
              <li>{scopedT("dataCollection.progress")}</li>
              <li>{scopedT("dataCollection.achievements")}</li>
              <li>{scopedT("dataCollection.playTime")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("dataUsage.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>{scopedT("dataUsage.gameExperience")}</li>
              <li>{scopedT("dataUsage.leaderboards")}</li>
              <li>{scopedT("dataUsage.personalizedContent")}</li>
              <li>{scopedT("dataUsage.analytics")}</li>
              <li>{scopedT("dataUsage.communication")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("cookies.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("cookies.intro")}</p>
            <h4>{scopedT("cookies.types")}</h4>
            <ul>
              <li><strong>{scopedT("cookies.essential.name")}:</strong> {scopedT("cookies.essential.description")}</li>
              <li><strong>{scopedT("cookies.performance.name")}:</strong> {scopedT("cookies.performance.description")}</li>
              <li><strong>{scopedT("cookies.preferences.name")}:</strong> {scopedT("cookies.preferences.description")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("dataSharing.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("dataSharing.policy")}</p>
            <ul>
              <li>{scopedT("dataSharing.serviceProviders")}</li>
              <li>{scopedT("dataSharing.legal")}</li>
              <li>{scopedT("dataSharing.businessTransfer")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("dataSecurity.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("dataSecurity.measures")}</p>
            <ul>
              <li>{scopedT("dataSecurity.encryption")}</li>
              <li>{scopedT("dataSecurity.access")}</li>
              <li>{scopedT("dataSecurity.monitoring")}</li>
              <li>{scopedT("dataSecurity.updates")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("userRights.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li><strong>{scopedT("userRights.access")}:</strong> {scopedT("userRights.accessDescription")}</li>
              <li><strong>{scopedT("userRights.correction")}:</strong> {scopedT("userRights.correctionDescription")}</li>
              <li><strong>{scopedT("userRights.deletion")}:</strong> {scopedT("userRights.deletionDescription")}</li>
              <li><strong>{scopedT("userRights.portability")}:</strong> {scopedT("userRights.portabilityDescription")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scopedT("minors.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{scopedT("minors.policy")}</p>
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