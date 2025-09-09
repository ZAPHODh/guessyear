import Script from "next/script";

export default function Adsense() {
    return (
        <>
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT!}`}
                crossOrigin="anonymous"
                strategy="lazyOnload"
            ></Script>
            <meta name="google-adsense-account" content={`${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT!}`}></meta>
        </>
    );
}