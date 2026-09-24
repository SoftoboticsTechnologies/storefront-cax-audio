import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import type {CatalogFacet} from '@/features/search/data';
import {HeroCarousel} from '@/site/home/hero-carousel';
import {HERO_SLIDES, resolveHeroSlideHref} from '@/site/home/hero-slides';
// Hero finder form disabled for now — kept for future use. To re-enable,
// uncomment this import, the destructured props below and render it.
// import {HeroFinder} from '@/site/home/hero-finder';

interface HeroSectionProps {
    /** Every collection slug, used to point each banner at its make's collection. */
    collectionSlugs: string[];
    brandFacet?: CatalogFacet;
    categories: Array<{slug: string; name: string}>;
}

export async function HeroSection({collectionSlugs /*, brandFacet, categories */}: HeroSectionProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Hero'});

    const slides = HERO_SLIDES.map((slide) => ({
        image: slide.image,
        href: resolveHeroSlideHref(slide, collectionSlugs),
        eyebrow: t(`slides.${slide.key}.eyebrow`),
        title: t(`slides.${slide.key}.title`),
        description: t(`slides.${slide.key}.description`),
        cta: t(`slides.${slide.key}.cta`),
    }));

    return (
        <section className="relative border-b bg-black">
            {/* The banners carry their headline as artwork and each slide has its own
                caption, so the page-level h1 is for screen readers and search engines. */}
            <h1 className="sr-only">
                {t('titleStart')} {t('titleHighlight')} {t('titleEnd')}
            </h1>
            <HeroCarousel
                slides={slides}
                labels={{
                    previous: t('previousSlide'),
                    next: t('nextSlide'),
                    goTo: slides.map((_, index) => t('goToSlide', {number: index + 1})),
                }}
            />
        </section>
    );
}
