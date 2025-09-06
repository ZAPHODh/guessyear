import { ImageResponse } from "next/og";
import { RenderIMGEl } from "@/components/OGImgEl";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const page = searchParams.get("page");

    const site = siteConfig(locale);

    try {
        return new ImageResponse(
            RenderIMGEl({
                siteName: site.name,
                locale,
                isDailyPage: page === 'daily',
            }),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}