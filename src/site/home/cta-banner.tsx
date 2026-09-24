import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import { Link } from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';

export async function CtaBanner() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 md:px-12 md:py-14 text-primary-foreground">
                    <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-24 size-80 rounded-full bg-white/15 blur-2xl" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-xl space-y-3">
                            <h2 className="font-display text-4xl md:text-5xl">{t('ctaBanner.title')}</h2>
                            <p className="leading-relaxed text-primary-foreground/90">{t('ctaBanner.subtitle')}</p>
                        </div>
                        <Button
                            render={<Link href="/register" />}
                            nativeButton={false}
                            size="lg"
                            className="h-12 shrink-0 rounded-full bg-navy px-7 text-sm font-semibold text-navy-foreground hover:bg-navy/90"
                        >
                            {t('ctaBanner.cta')}
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
