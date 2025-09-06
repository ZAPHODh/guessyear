import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const page = searchParams.get("page");

    const site = siteConfig(locale);

    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'system-ui',
                        color: 'white',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '72px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            {site.name}
                        </div>
                    </div>

                    {page === 'daily' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.9 }}>
                                📸
                            </div>
                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                                Daily Photo Challenge
                            </div>
                            <div style={{ fontSize: '24px', opacity: 0.8 }}>
                                Guess the year this photo was taken!
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.9 }}>
                                🎯
                            </div>
                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                                Guess the Year
                            </div>
                            <div style={{ fontSize: '24px', opacity: 0.8 }}>
                                Challenge your visual skills with vintage photos
                            </div>
                        </div>
                    )}

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '40px',
                            fontSize: '18px',
                            opacity: 0.7,
                        }}
                    >
                        /{locale}
                    </div>
                </div>
            ),
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