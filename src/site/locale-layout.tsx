import type {Metadata, Viewport} from "next";
import Script from "next/script";
import {locale as rootLocale} from "next/root-params";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {Barlow, Bebas_Neue, Geist_Mono} from "next/font/google";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/platform/i18n/routing";
import {toOgLocale} from "@/platform/i18n/locale-utils";
import {getRouteLocale} from "@/platform/i18n/server";
import {Toaster} from "@/components/ui/sonner";
import {Navbar} from '@/site/navigation/navbar';
import {Footer} from "@/site/footer";
import {AnnouncementBar} from "@/site/announcement-bar";
import {WhatsAppButton} from "@/site/whatsapp-button";
import {BusinessJsonLd} from "@/site/business-json-ld";
import {ThemeProvider} from "@/site/providers/theme-provider";
import {AuthProvider} from "@/features/authentication/auth-context";
import {SITE_NAME, SITE_URL} from "@/config/metadata";

const barlow = Barlow({
    variable: "--font-barlow",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
    variable: "--font-bebas-neue",
    subsets: ["latin"],
    weight: "400",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const ogLocale = toOgLocale(locale);
    const t = await getTranslations({locale, namespace: 'Common'});

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: SITE_NAME,
            template: `%s | ${SITE_NAME}`,
        },
        description: t('siteDescription', {siteName: SITE_NAME}),
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: ogLocale,
        },
        twitter: {
            card: "summary_large_image",
        },
        // /favicon.ico itself comes from the src/app/favicon.ico file convention.
        // favicon.svg is deliberately not linked: it's a ~1.4MB embedded raster.
        icons: {
            icon: [{url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png"}],
            apple: "/favicon/apple-touch-icon.png",
        },
        manifest: "/favicon/site.webmanifest",
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, `/${l}`])
            ),
        },
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#0b1220"},
    ],
};

export default async function LocaleLayout({children}: {children: React.ReactNode}) {
    const locale = await rootLocale();

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages({locale});

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body
                className={`${barlow.variable} ${bebasNeue.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <BusinessJsonLd/>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider>
                        <AuthProvider>
                            <AnnouncementBar />
                            <Navbar />
                            {children}
                            <Footer/>
                            <WhatsAppButton/>
                            <Toaster/>
                        </AuthProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
                <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
            </body>
        </html>
    );
}
