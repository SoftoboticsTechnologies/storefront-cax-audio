import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {SITE_NAME} from '@/config/metadata';
import {SectionHeading} from '@/components/ui/section-heading';

const featureKeys = ['highQuality', 'bestPrices', 'securePayments', 'fastDelivery'] as const;

export async function BenefitsSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="relative overflow-hidden bg-navy py-16 md:py-24 text-navy-foreground">
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl" />
            <div className="container relative mx-auto px-4">
                <SectionHeading
                    inverted
                    eyebrow={t('why.eyebrow', {siteName: SITE_NAME})}
                    title={t('why.title')}
                    highlight={t('why.highlight')}
                    description={t('why.description')}
                />
                <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {featureKeys.map((key, index) => (
                        <li key={key} className="rounded-xl border border-white/10 bg-navy-muted/60 p-6 transition-colors hover:border-primary/50">
                            <span className="inline-flex h-7 min-w-10 items-center justify-center rounded-full border border-primary/40 px-2 font-display text-base text-primary">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-5 font-display text-2xl">{t(`features.${key}.title`)}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-navy-foreground/65">{t(`features.${key}.description`)}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
