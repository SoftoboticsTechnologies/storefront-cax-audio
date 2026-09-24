import {ArrowRight} from "lucide-react";
import { Link } from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {facetParam, type CatalogFacet} from '@/features/search/data';
import {SectionHeading, sectionActionClassName} from '@/components/ui/section-heading';
import {cn} from '@/lib/utils';
import {getBrandLogo} from '@/site/home/brand-logos';

const MAX_BRANDS = 12;

export async function BrandGrid({facet}: {facet: CatalogFacet}) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home.brands'});
    // Brands with products, plus recognised makes that have none yet (so a
    // make like Mercedes-Benz shows before its products are tagged). Generic
    // values such as "Other Vehicles" appear only once they have products.
    const values = facet.values
        .map((value) => ({...value, logo: getBrandLogo(value.code, value.name)}))
        .filter((value) => value.count > 0 || value.logo)
        .slice(0, MAX_BRANDS);

    if (values.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-16 bg-muted/60">
            <div className="container mx-auto px-4">
                <SectionHeading
                    eyebrow={t('eyebrow')}
                    title={t('title')}
                    highlight={t('highlight')}
                    description={t('description')}
                    action={
                        <Link href="/search" className={sectionActionClassName}>
                            {t('viewAll')}
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    }
                />
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-5">
                    {values.map((value) => (
                        <li key={value.id}>
                            <Link
                                href={`/search?facets=${encodeURIComponent(facetParam(facet.id, value.id))}`}
                                className="group flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
                            >
                                {value.logo && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'size-14 bg-foreground transition-transform duration-300 group-hover:scale-110 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]',
                                            value.logo.color && 'bg-(--brand) dark:bg-foreground',
                                        )}
                                        style={{
                                            maskImage: `url(${value.logo.src})`,
                                            WebkitMaskImage: `url(${value.logo.src})`,
                                            ...(value.logo.color && {'--brand': value.logo.color}),
                                        } as React.CSSProperties}
                                    />
                                )}
                                <span className="font-display text-2xl transition-colors group-hover:text-primary">
                                    {value.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
