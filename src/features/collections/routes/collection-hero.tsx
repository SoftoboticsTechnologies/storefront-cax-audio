import Image from 'next/image';
import {ArrowDown} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {truncateDescription} from '@/config/metadata';
import {getCategoryFallbackImage} from '@/features/collections/fallback-images';

interface CollectionHeroProps {
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    /** id of the product grid the CTA scrolls to. */
    productsAnchor: string;
}

/**
 * Navy split banner at the top of a collection page, in the style of the
 * homepage editorial banner: name, description and CTA left, the collection's
 * featured asset (or a slug-matched fallback photo) right. Everything shown
 * comes from the Vendure collection.
 */
export async function CollectionHero({name, slug, description, image, productsAnchor}: CollectionHeroProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Collection'});
    const src = image || getCategoryFallbackImage(slug);
    // Vendure descriptions are HTML; show them as plain text.
    const text = truncateDescription(description, 220) || t('heroFallbackDescription', {name});

    return (
        <section className="relative mb-10 grid overflow-hidden rounded-2xl bg-navy text-navy-foreground md:grid-cols-2 min-h-[16rem] md:min-h-[20rem]">
            <div className="relative z-10 flex flex-col justify-center p-8 md:p-12">
                <span className="eyebrow mb-3">{t('heroEyebrow')}</span>
                <h1 className="font-display text-4xl md:text-6xl mb-4">{name}</h1>
                <p className="text-navy-foreground/75 leading-relaxed mb-7 max-w-md line-clamp-3">{text}</p>
                <a
                    href={`#${productsAnchor}`}
                    className="group inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    {t('heroCta')}
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden/>
                </a>
            </div>
            {/* Below md the photo fills the whole card behind the text; md+ it is the right half. */}
            <div className="absolute inset-0 md:relative md:inset-auto">
                {src && (
                    <Image
                        src={src}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}
                <div className="absolute inset-0 bg-navy/75 md:bg-transparent md:bg-gradient-to-r md:from-navy md:via-navy/30 md:to-transparent"/>
            </div>
        </section>
    );
}
