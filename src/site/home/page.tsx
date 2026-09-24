import type {Metadata} from "next";
import {Suspense} from "react";
import {getRouteLocale} from "@/platform/i18n/server";
import {HeroSection} from "@/site/home/hero-section";
import {CategoryDiscovery} from "@/site/home/category-discovery";
import {EditorialBanner} from "@/site/home/editorial-banner";
import {TrustStrip} from "@/site/home/trust-strip";
import {BrandGrid} from "@/site/home/brand-grid";
import {BenefitsSection} from "@/site/home/benefits-section";
import {CtaBanner} from "@/site/home/cta-banner";
import {FeaturedProducts, TrendingProducts} from '@/features/products/featured-products';
import {getRootCollections, getTopCollections} from '@/features/collections/data';
import {getCatalogFacet} from '@/features/search/data';
import {HOME_BRAND_FACET_CODE} from '@/site/home/config';
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/config/metadata";
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/platform/i18n/locale-utils';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});
    const ogLocale = toOgLocale(locale);

    return {
        title: {
            absolute: `${SITE_NAME} - ${t('pageTitle')}`,
        },
        description: t('description'),
        alternates: {
            canonical: buildCanonicalUrl("/"),
        },
        openGraph: {
            title: `${SITE_NAME} - ${t('pageTitle')}`,
            description: t('ogDescription'),
            type: "website",
            locale: ogLocale,
            url: SITE_URL,
        },
    };
}

export default async function Home() {
    const locale = await getRouteLocale();
    const [collections, allCollections, brandFacet] = await Promise.all([
        getRootCollections(locale),
        getTopCollections(locale),
        getCatalogFacet(locale, HOME_BRAND_FACET_CODE),
    ]);
    const primary = collections[0];
    const secondary = collections.length > 1 ? collections[1] : undefined;

    return (
        <div className="min-h-screen">
            <HeroSection
                collectionSlugs={allCollections.map((c) => c.slug)}
                brandFacet={brandFacet}
                categories={collections.map(({slug, name}) => ({slug, name}))}
            />

            <TrustStrip/>

            <CategoryDiscovery/>

            {/* Whole catalog rather than `primary`, which may have no products of its own. */}
            <Suspense>
                <FeaturedProducts/>
            </Suspense>

            {brandFacet && brandFacet.values.length > 0 && <BrandGrid facet={brandFacet}/>}

            {primary && (
                <Suspense>
                    <TrendingProducts collectionSlug={(secondary ?? primary).slug}/>
                </Suspense>
            )}

            <BenefitsSection/>

            {secondary && <EditorialBanner collectionSlug={secondary.slug}/>}

            <CtaBanner/>
        </div>
    );
}
