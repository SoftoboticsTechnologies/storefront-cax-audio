import {ProductCarousel} from "@/features/products/components/product-carousel";
import {getRouteLocale} from "@/platform/i18n/server";
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {query} from "@/platform/vendure/api";
import {GetCollectionProductsQuery} from '@/features/collections/graphql';
import {SearchProductsQuery} from '@/features/search/graphql';
import { Link } from '@/platform/i18n/navigation';
import {ArrowRight} from "lucide-react";
import {getTranslations} from 'next-intl/server';
import {preconnect} from 'react-dom';
import {readFragment} from '@/platform/vendure/graphql';
import {ProductCardFragment} from '@/features/products/graphql';
import {sectionActionClassName} from '@/components/ui/section-heading';

function getAssetOrigin(preview?: string) {
    if (!preview) return undefined;

    try {
        return new URL(preview).origin;
    } catch {
        return undefined;
    }
}

async function getCollectionProducts(collectionSlug: string | undefined, currencyCode: string) {
    const locale = await getRouteLocale();

    if (!collectionSlug) {
        const result = await query(SearchProductsQuery, {
            input: {take: 12, skip: 0, groupByProduct: true},
        }, {languageCode: locale, currencyCode});

        return result.data.search.items;
    }

    const result = await query(GetCollectionProductsQuery, {
        slug: collectionSlug,
        input: {
            collectionSlug,
            take: 12,
            skip: 0,
            groupByProduct: true
        }
    }, {languageCode: locale, currencyCode});

    return result.data.search.items;
}

interface CollectionCarouselSectionProps {
    collectionSlug?: string;
    heading: {eyebrow: string; title: string; highlight: string};
    preloadFirstProduct?: boolean;
}

async function CollectionCarouselSection({collectionSlug, heading, preloadFirstProduct}: CollectionCarouselSectionProps) {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});
    const products = await getCollectionProducts(collectionSlug, currencyCode);
    const firstProduct = products[0]
        ? readFragment(ProductCardFragment, products[0])
        : undefined;
    const assetOrigin = getAssetOrigin(firstProduct?.productAsset?.preview);

    if (preloadFirstProduct && assetOrigin) {
        preconnect(assetOrigin);
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <ProductCarousel
            {...heading}
            action={
                <Link href={collectionSlug ? `/collection/${collectionSlug}` : '/search'} className={sectionActionClassName}>
                    {t('viewAllProducts')}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            }
            products={products}
            preloadFirstProduct={preloadFirstProduct}
        />
    )
}

interface CollectionProductsProps {
    /** Omit to feature products from the whole catalog. */
    collectionSlug?: string;
}

export async function FeaturedProducts({collectionSlug}: CollectionProductsProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Product'});

    return (
        <CollectionCarouselSection
            collectionSlug={collectionSlug}
            heading={{
                eyebrow: t('featuredSection.eyebrow'),
                title: t('featuredSection.title'),
                highlight: t('featuredSection.highlight'),
            }}
            preloadFirstProduct
        />
    );
}

export async function TrendingProducts({collectionSlug}: CollectionProductsProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Product'});

    return (
        <CollectionCarouselSection
            collectionSlug={collectionSlug}
            heading={{
                eyebrow: t('trendingSection.eyebrow'),
                title: t('trendingSection.title'),
                highlight: t('trendingSection.highlight'),
            }}
        />
    );
}
