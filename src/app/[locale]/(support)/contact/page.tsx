import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import { siteConfig } from "@/config/site";
import { getCurrentSession } from "@/lib/server/auth/session";
import SupportContactForm from "@/components/support/support-contact-form";
import Link from "next/link";

export default async function ContactPage() {
  const scopedT = await getScopedI18n("contact");
  const locale = await getCurrentLocale();
  const config = siteConfig(locale);
  const { user } = await getCurrentSession();

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {scopedT("form.title")}
              </CardTitle>
              <CardDescription>
                {scopedT("form.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportContactForm
                defaultName={user?.name || ""}
                defaultEmail={user?.email || ""}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📞 {scopedT("info.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-lg">
                  📧
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{scopedT("info.email")}</h4>
                  <a href={`mailto:${config.email}`} className="text-blue-600 hover:underline">
                    {config.email}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scopedT("info.emailDescription")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-lg">
                  📱
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{scopedT("info.phone")}</h4>
                  <a href={`tel:${config.tel}`} className="text-blue-600 hover:underline">
                    {config.tel}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scopedT("info.phoneDescription")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-lg">
                  📍
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{scopedT("info.address")}</h4>
                  <p className="text-muted-foreground">{config.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 {scopedT("quickHelp.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/help">
                    ❓ {scopedT("quickHelp.faq")}
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/how-to-play">
                    🎯 {scopedT("quickHelp.howToPlay")}
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/lobby">
                    💬 {scopedT("quickHelp.community")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌐 {scopedT("social.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={config.links.twitter} target="_blank" rel="noopener noreferrer">
                    🐦 Twitter
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={config.links.facebook} target="_blank" rel="noopener noreferrer">
                    👥 Facebook
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={config.links.instagram} target="_blank" rel="noopener noreferrer">
                    📸 Instagram
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={config.links.github} target="_blank" rel="noopener noreferrer">
                    💻 GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}