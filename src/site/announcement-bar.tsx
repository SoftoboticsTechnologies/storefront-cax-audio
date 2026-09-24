import {LayoutGrid, Phone, ShieldCheck} from 'lucide-react';
import {BUSINESS, telHref} from '@/config/business';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';

export async function AnnouncementBar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'AnnouncementBar'});

    return (
        <div className="bg-navy text-navy-foreground text-xs font-medium">
            <div className="container mx-auto px-4 h-8 flex items-center justify-center gap-x-8 text-center">
                <span className="hidden sm:inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" aria-hidden />
                    {t('message1')}
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5">
                    <LayoutGrid className="size-3.5 text-primary" aria-hidden />
                    {t('message2')}
                </span>
                <a href={telHref} className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone className="size-3.5 text-primary" aria-hidden />
                    {t('callUs')}
                    <span className="font-bold text-primary">{BUSINESS.phoneDisplay}</span>
                </a>
            </div>
        </div>
    );
}
