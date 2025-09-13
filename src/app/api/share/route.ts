import { ImageResponse } from "next/og";
import { ShareImageEl } from "@/components/ShareImageEl";
import { siteConfig } from "@/config/site";

export const runtime = "edge";



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const attempts = searchParams.get("attempts");
    const won = searchParams.get("won") === "true";
    const correctYear = searchParams.get("correctYear");

    const site = siteConfig(locale);

    try {
        return new ImageResponse(
            ShareImageEl({
                siteName: site.name,
                locale,
                attempts: attempts || "0",
                won,
                correctYear: correctYear || "",
            }),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response(`Failed to generate the share image`, {
            status: 500,
        });
    }
}