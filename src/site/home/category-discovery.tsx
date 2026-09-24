import Image from "next/image";
import {ArrowRight} from "lucide-react";
import { Link } from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getRootCollections} from '@/features/collections/data';
import {SectionHeading, sectionActionClassName} from '@/components/ui/section-heading';
import {getCategoryFallbackImage} from '@/features/collections/fallback-images';

const MAX_TILES = 12;

export async function CategoryDiscovery() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home.categories'});
    // Top-level collections only (makes, categories) — models like "BMW 1 Series" are left out.
    const collections = (await getRootCollections(locale)).slice(0, MAX_TILES);

    if (collections.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-16">
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
                    {collections.map((collection) => {
                        // Vendure's featured asset wins; the fallback only fills empty tiles.
                        const image = collection.featuredAsset?.preview
                            ? `${collection.featuredAsset.preview}?preset=medium`
                            : getCategoryFallbackImage(collection.slug);

                        return (
                            <li key={collection.id}>
                                <Link
                                    href={`/collection/${collection.slug}`}
                                    // See product-card.tsx: default prefetch hits a Next.js 16
                                    // static-export bug (vercel/next.js#85374).
                                    prefetch={false}
                                    className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
                                >
                                    <div className="relative aspect-square bg-muted overflow-hidden">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt=""
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                                            />
                                        ) : (
                                            <span aria-hidden className="absolute inset-0 flex items-center justify-center font-display text-6xl text-muted-foreground/25 transition-colors group-hover:text-primary/40">
                                                {collection.name.trim().charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="flex flex-1 items-center justify-center border-t px-2 py-3 text-center text-xs font-bold uppercase tracking-wide line-clamp-2 transition-colors group-hover:text-primary">
                                        {collection.name.trim()}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
