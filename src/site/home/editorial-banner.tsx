import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import {ArrowRight} from "lucide-react";
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTopCollections} from '@/features/collections/data';

/**
 * Site-curated banner photos (public/banners/*), matched on collection slug
 * keywords (no IDs hardcoded). A match wins over the collection's Vendure
 * featured asset; other collections keep using theirs. Attribution in
 * /public/banners/CREDITS.txt.
 */
const BANNER_IMAGES: {match: RegExp; image: string}[] = [
    {match: /mercedes/, image: '/banners/mercedes-interior.webp'},
];

interface EditorialBannerProps {
    collectionSlug: string;
}

export async function EditorialBanner({collectionSlug}: EditorialBannerProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});
    const collections = await getTopCollections(locale);
    const collection = collections.find((c) => c.slug === collectionSlug);

    if (!collection) {
        return null;
    }

    const image = BANNER_IMAGES.find(({match}) => match.test(collection.slug.toLowerCase()))?.image
        ?? collection.featuredAsset?.preview;

    return (
        <section className="pt-12 md:pt-16 pb-0">
            <div className="container mx-auto px-4">
                <Link
                    href={`/collection/${collection.slug}`}
                    // See product-card.tsx: default prefetch hits a Next.js 16
                    // static-export bug (vercel/next.js#85374).
                    prefetch={false}
                    className="group relative grid overflow-hidden rounded-2xl bg-navy text-navy-foreground md:grid-cols-2 min-h-[18rem] md:min-h-[22rem]"
                >
                    <div className="relative z-10 flex flex-col justify-center p-8 md:p-12">
                        <span className="eyebrow mb-3">{t('editorialBanner.eyebrow')}</span>
                        <h2 className="font-display text-4xl md:text-6xl mb-4">
                            {collection.name}
                        </h2>
                        <p className="text-navy-foreground/75 leading-relaxed mb-7 max-w-md line-clamp-3">
                            {collection.description?.trim() || t('editorialBanner.fallbackDescription')}
                        </p>
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                            {t('editorialBanner.cta')}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                    {/* Below md the photo fills the whole card behind the text; md+ it is the right half. */}
                    {/* overflow-hidden: the hover zoom must not spill past the fade into the text column. */}
                    <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto">
                        {image && (
                            <Image
                                src={image}
                                alt=""
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        )}
                        <div className="absolute inset-0 bg-navy/75 md:bg-transparent md:bg-gradient-to-r md:from-navy md:via-navy/30 md:to-transparent" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
